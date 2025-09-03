import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import archiver from 'archiver';
import path from 'path';

const API_BASE_URL = 'http://sacramento.valle.us:6221';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
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
        // Get file details
        const filename = file.originalFilename || file.name || 'file.mp4';
        
        console.log('Extracting JPG frames from video:', filename, 'Size:', file.size);
        
        // Create form data for external API
        const formData = new FormData();
        const fileStream = fs.createReadStream(filepath);
        formData.append('file', fileStream, {
          filename: filename,
          contentType: file.mimetype || 'application/octet-stream',
        });
        
        console.log('Extracting JPG frames from video:', filename, 'Size:', file.size);
        
        // Send to external API with as_zip parameter based on filtering needs
        const needsFiltering = req.headers['x-excluded-frames'];
        const apiUrl = needsFiltering ? `${API_BASE_URL}/video-to-jpg?as_zip=false` : `${API_BASE_URL}/video-to-jpg`;
        
        console.log('Forwarding to API:', apiUrl);
        
        const response = await fetch(apiUrl, {
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

        // Check if response is JSON or ZIP
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          // Parse JSON response
          data = await response.json();
          console.log('API response:', data.message, `- ${data.frames.length} frames`);
        } else {
          // Response is already a ZIP, just forward it
          const buffer = await response.buffer();
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Disposition', 'attachment; filename="frames.zip"');
          res.status(200).send(buffer);
          fs.unlinkSync(filepath);
          return resolve();
        }
        
        // Create a ZIP archive
        const archive = archiver('zip', {
          zlib: { level: 9 } // Maximum compression
        });
        
        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="frames.zip"');
        
        // Pipe archive data to the response
        archive.pipe(res);
        
        // Get excluded frames from query parameters (if any)
        const excludedFramesParam = req.headers['x-excluded-frames'];
        const excludedFrames = excludedFramesParam ? JSON.parse(excludedFramesParam) : [];
        
        // Fetch each frame and add to ZIP (excluding filtered frames)
        let frameNumber = 1;
        for (let i = 0; i < data.frames.length; i++) {
          // Skip excluded frames
          if (excludedFrames.includes(i)) {
            console.log(`Skipping excluded frame ${i + 1}`);
            continue;
          }
          
          const framePath = data.frames[i];
          const frameFilename = `frame_${String(frameNumber).padStart(3, '0')}.jpg`;
          
          console.log(`Fetching frame ${i + 1}/${data.frames.length}: ${framePath}`);
          
          // Fetch the frame from the API
          const frameResponse = await fetch(`${API_BASE_URL}${framePath}`);
          if (frameResponse.ok) {
            const frameBuffer = await frameResponse.buffer();
            archive.append(frameBuffer, { name: frameFilename });
            frameNumber++;
          } else {
            console.error(`Failed to fetch frame: ${framePath}`);
          }
        }
        
        // Finalize the archive
        await archive.finalize();
        
        // Clean up uploaded file
        fs.unlinkSync(filepath);
        
        console.log('Successfully created ZIP with', data.frames.length, 'frames');
        resolve();
      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Processing failed', details: error.message });
        
        // Clean up if file exists
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        resolve();
      }
    });
  });
}