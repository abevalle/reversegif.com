import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

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

      try {
        // Get file details
        const filepath = file.filepath || file.path;
        const filename = file.originalFilename || file.name || 'file.gif';
        
        console.log('Processing GIF to MP4:', filename, 'Size:', file.size);
        
        // Create form data for external API
        const formData = new FormData();
        const fileStream = fs.createReadStream(filepath);
        formData.append('file', fileStream, {
          filename: filename,
          contentType: file.mimetype || 'application/octet-stream',
        });
        
        console.log('Forwarding to API:', `${API_BASE_URL}/gif-to-mp4`);
        
        // Send to external API
        const response = await fetch(`${API_BASE_URL}/gif-to-mp4`, {
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

        // Get the response data
        const buffer = await response.buffer();
        
        // Send back to client
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.mp4"');
        res.status(200).send(buffer);
        
        // Clean up
        fs.unlinkSync(filepath);
        resolve();
      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Processing failed', details: error.message });
        resolve();
      }
    });
  });
}