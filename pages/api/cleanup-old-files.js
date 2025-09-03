import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

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
  // Optional: Add authentication here to prevent unauthorized cleanup
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.CLEANUP_SECRET}` && process.env.CLEANUP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // List all objects in the uploads folder
    const listCommand = new ListObjectsV2Command({
      Bucket: 'reversegiffaas',
      Prefix: 'uploads/',
    });

    const listResult = await s3Client.send(listCommand);
    
    if (!listResult.Contents || listResult.Contents.length === 0) {
      return res.status(200).json({ 
        message: 'No files to clean up',
        deleted: 0 
      });
    }

    // Filter files older than 24 hours
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    const filesToDelete = listResult.Contents.filter(file => {
      return file.LastModified && new Date(file.LastModified) < twentyFourHoursAgo;
    });

    if (filesToDelete.length === 0) {
      return res.status(200).json({ 
        message: 'No old files to clean up',
        checked: listResult.Contents.length,
        deleted: 0 
      });
    }

    // Delete old files in batches (max 1000 per request)
    const deleteObjects = filesToDelete.slice(0, 1000).map(file => ({
      Key: file.Key
    }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: 'reversegiffaas',
      Delete: {
        Objects: deleteObjects,
        Quiet: false,
      },
    });

    const deleteResult = await s3Client.send(deleteCommand);
    
    const deletedCount = deleteResult.Deleted ? deleteResult.Deleted.length : 0;
    console.log(`Cleaned up ${deletedCount} old files`);

    res.status(200).json({
      message: 'Cleanup completed',
      checked: listResult.Contents.length,
      deleted: deletedCount,
      deletedFiles: deleteResult.Deleted?.map(d => d.Key) || [],
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup old files',
      message: error.message 
    });
  }
}