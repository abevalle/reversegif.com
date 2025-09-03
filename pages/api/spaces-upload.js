import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Initialize DO Spaces client (S3-compatible)
const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1', // DO Spaces uses us-east-1 for compatibility
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

  try {
    const { filename, contentType, operation } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Generate unique key for the file
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const key = `uploads/${timestamp}-${randomString}/${filename}`;

    // Create pre-signed URL for upload
    const command = new PutObjectCommand({
      Bucket: 'reversegiffaas',
      Key: key,
      ContentType: contentType || 'image/gif',
    });

    // Generate pre-signed URL (expires in 5 minutes)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // Return upload URL and file location
    res.status(200).json({
      uploadUrl,
      key,
      url: `https://reversegiffaas.nyc3.digitaloceanspaces.com/${key}`,
      cdnUrl: `https://reversegiffaas.nyc3.cdn.digitaloceanspaces.com/${key}`,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}