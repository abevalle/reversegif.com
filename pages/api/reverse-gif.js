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
        
        console.log('Processing file:', filename, 'Size:', file.size);
        
        // Create form data for external API
        const formData = new FormData();
        const fileStream = fs.createReadStream(filepath);
        formData.append('file', fileStream, {
          filename: filename,
          contentType: file.mimetype || 'application/octet-stream',
        });
        
        console.log('Forwarding to API:', `${API_BASE_URL}/reverse-gif`);
        
        // Send to external API with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        let response;
        try {
          response = await fetch(`${API_BASE_URL}/reverse-gif`, {
            method: 'POST',
            body: formData,
            headers: {
              ...formData.getHeaders(),
            },
            signal: controller.signal,
          });
        } catch (fetchError) {
          clearTimeout(timeout);
          console.error('Fetch error:', fetchError);
          
          let statusCode = 500;
          let errorMessage = 'Processing failed';
          let errorDetails = fetchError.message;
          
          if (fetchError.name === 'AbortError') {
            statusCode = 504;
            errorMessage = 'Request timeout';
            errorDetails = 'The request took too long to complete. Please try again with a smaller file.';
          } else if (fetchError.message.includes('ECONNREFUSED')) {
            statusCode = 503;
            errorMessage = 'Service unavailable';
            errorDetails = 'The processing service is currently unavailable. Please try again later.';
          } else if (fetchError.message.includes('ENOTFOUND') || fetchError.message.includes('EAI_AGAIN')) {
            statusCode = 503;
            errorMessage = 'Service unreachable';
            errorDetails = 'Cannot reach the processing service. Please check your connection and try again.';
          }
          
          res.status(statusCode).json({ error: errorMessage, details: errorDetails });
          fs.unlinkSync(filepath);
          return resolve();
        }
        
        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', response.status, errorText);
          
          let statusCode = response.status;
          let errorMessage = 'Processing failed';
          let errorDetails = errorText;
          
          if (response.status === 413) {
            errorMessage = 'File too large';
            errorDetails = 'The file exceeds the maximum size limit. Please try a smaller file.';
          } else if (response.status === 500) {
            errorMessage = 'Server error';
            errorDetails = 'The processing server encountered an error. Please try again.';
          } else if (response.status === 503) {
            errorMessage = 'Service unavailable';
            errorDetails = 'The processing service is temporarily unavailable. Please try again later.';
          }
          
          res.status(statusCode).json({ error: errorMessage, details: errorDetails });
          fs.unlinkSync(filepath);
          return resolve();
        }

        // Get the response data
        const buffer = await response.buffer();
        
        // Send back to client
        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/gif');
        res.setHeader('Content-Disposition', 'attachment; filename="reversed.gif"');
        res.status(200).send(buffer);
        
        // Clean up
        fs.unlinkSync(filepath);
        resolve();
      } catch (error) {
        console.error('Processing error:', error);
        
        // Clean up file if it exists
        if (file && (file.filepath || file.path)) {
          const filepath = file.filepath || file.path;
          try {
            fs.unlinkSync(filepath);
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        }
        
        res.status(500).json({ error: 'Processing failed', details: error.message });
        resolve();
      }
    });
  });
}