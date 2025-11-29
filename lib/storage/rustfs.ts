import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (!process.env.RUSTFS_ENDPOINT) {
  throw new Error('RUSTFS_ENDPOINT is not set');
}

if (!process.env.RUSTFS_ACCESS_KEY) {
  throw new Error('RUSTFS_ACCESS_KEY is not set');
}

if (!process.env.RUSTFS_SECRET_KEY) {
  throw new Error('RUSTFS_SECRET_KEY is not set');
}

if (!process.env.RUSTFS_BUCKET_NAME) {
  throw new Error('RUSTFS_BUCKET_NAME is not set');
}

// Initialize S3 client for RustFS
export const s3Client = new S3Client({
  endpoint: process.env.RUSTFS_ENDPOINT,
  region: process.env.RUSTFS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.RUSTFS_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_SECRET_KEY,
  },
  forcePathStyle: true, // Required for S3-compatible storage
});

export const BUCKET_NAME = process.env.RUSTFS_BUCKET_NAME;

export interface UploadOptions {
  key: string;
  file: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
}

export async function uploadFile(options: UploadOptions): Promise<string> {
  const { key, file, contentType, metadata } = options;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: metadata,
      })
    );

    // Return public URL
    return `${process.env.RUSTFS_ENDPOINT}/${BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw new Error('Failed to generate signed URL');
  }
}

