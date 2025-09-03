import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const API_BASE_URL = 'http://sacramento.valle.us:6221';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();
  form.maxFileSize = 100 * 1024 * 1024; // 100MB
  
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        res.status(500).json({ error: 'Error parsing form data' });
        return resolve();
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        console.error('No file in request');
        res.status(400).json({ error: 'No file uploaded' });
        return resolve();
      }

      const filepath = file.filepath || file.path;
      
      try {
        const filename = file.originalFilename || file.name || 'file.mp4';
        
        console.log('Getting PNG frame preview for:', filename, 'Size:', file.size);
        
        // Create form data for external API
        const formData = new FormData();
        const fileStream = fs.createReadStream(filepath);
        formData.append('file', fileStream, {
          filename: filename,
          contentType: file.mimetype || 'application/octet-stream',
        });
        
        // Send to external API with as_zip=false as query parameter
        const response = await fetch(`${API_BASE_URL}/video-to-png?as_zip=false`, {
          method: 'POST',
          body: formData,
          headers: {
            ...formData.getHeaders(),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', response.status, errorText);
          res.status(500).json({ error: 'Processing failed', details: errorText });
          fs.unlinkSync(filepath);
          return resolve();
        }

        // Check response type
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
          // API returned ZIP instead of JSON, even with as_zip=false
          console.log('API returned ZIP instead of JSON, cannot provide frame previews');
          res.status(200).json({
            message: 'Frame extraction completed',
            totalFrames: 0,
            frames: [],
            paths: [],
            error: 'Preview not available - API returned ZIP format'
          });
          fs.unlinkSync(filepath);
          return resolve();
        }
        
        // Parse JSON response
        const data = await response.json();
        console.log('API response:', data.message);
        
        // Fetch preview frames (limit to first 10 for performance)
        const previewFrames = [];
        const maxPreviews = Math.min(10, data.frames.length);
        
        for (let i = 0; i < maxPreviews; i++) {
          const framePath = data.frames[i];
          try {
            const frameResponse = await fetch(`${API_BASE_URL}${framePath}`);
            if (frameResponse.ok) {
              const frameBuffer = await frameResponse.buffer();
              const base64 = frameBuffer.toString('base64');
              previewFrames.push({
                index: i,
                data: `data:image/png;base64,${base64}`,
                path: framePath
              });
            }
          } catch (err) {
            console.error(`Failed to fetch frame ${i}:`, err);
          }
        }
        
        // Return frame metadata and previews
        res.status(200).json({
          message: data.message,
          totalFrames: data.frames.length,
          frames: previewFrames,
          paths: data.frames
        });
        
        // Clean up uploaded file
        fs.unlinkSync(filepath);
        resolve();
      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Processing failed', details: error.message });
        
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        resolve();
      }
    });
  });
}