import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, url } = req.body;

    if (!key && !url) {
      return res.status(400).json({ error: 'No file key or URL provided' });
    }

    // Extract key from URL if URL is provided
    let fileKey = key;
    if (!fileKey && url) {
      // Extract key from URL like: https://reversegiffaas.nyc3.cdn.digitaloceanspaces.com/uploads/...
      const urlParts = url.split('.com/');
      if (urlParts.length > 1) {
        fileKey = urlParts[1];
      }
    }

    if (!fileKey) {
      return res.status(400).json({ error: 'Could not determine file key' });
    }

    // Delete from Spaces
    const deleteCommand = new DeleteObjectCommand({
      Bucket: 'reversegiffaas',
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);
    
    console.log(`Deleted file from Spaces: ${fileKey}`);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      key: fileKey,
    });
  } catch (error) {
    console.error('Delete error:', error);
    // Don't fail the whole process if deletion fails
    res.status(200).json({ 
      success: false,
      error: 'Failed to delete file, but continuing',
      message: error.message 
    });
  }
}