import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../env';

// Initialize S3 client for RustFS
export const s3Client = new S3Client({
  endpoint: env.RUSTFS_ENDPOINT,
  region: env.RUSTFS_REGION,
  credentials: {
    accessKeyId: env.RUSTFS_ACCESS_KEY,
    secretAccessKey: env.RUSTFS_SECRET_KEY,
  },
  forcePathStyle: true, // Required for S3-compatible storage
});

export const BUCKET_NAME = env.RUSTFS_BUCKET_NAME;

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

