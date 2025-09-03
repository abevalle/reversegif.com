import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize DO Spaces client
const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.DO_SPACES_KEY || '',
  },
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    maxFileSize: 256 * 1024 * 1024, // 256MB
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Read file
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Generate unique key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = file.originalFilename || 'file.gif';
    const key = `uploads/${timestamp}-${randomString}/${filename}`;

    // Upload to Spaces
    const uploadCommand = new PutObjectCommand({
      Bucket: 'reversegiffaas',
      Key: key,
      Body: fileBuffer,
      ContentType: file.mimetype || 'application/octet-stream',
      ACL: 'public-read',
    });

    await s3Client.send(uploadCommand);

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    // Return URLs
    res.status(200).json({
      key,
      url: `https://reversegiffaas.nyc3.digitaloceanspaces.com/${key}`,
      cdnUrl: `https://reversegiffaas.nyc3.cdn.digitaloceanspaces.com/${key}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}