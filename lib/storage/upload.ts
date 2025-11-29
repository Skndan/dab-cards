import sharp from 'sharp';
import { uploadFile } from './rustfs';
import { randomUUID } from 'crypto';

export interface ImageUploadOptions {
  file: Buffer;
  userId: string;
  type: 'profile' | 'banner' | 'logo' | 'background' | 'event';
}

export interface ImageUploadResult {
  originalUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
}

export async function uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult> {
  const { file, userId, type } = options;

  try {
    // Validate image
    const image = sharp(file);
    const metadata = await image.metadata();

    if (!metadata.format || !['jpeg', 'jpg', 'png', 'webp'].includes(metadata.format)) {
      throw new Error('Invalid image format. Only JPEG, PNG, and WebP are supported.');
    }

    const fileId = randomUUID();
    const extension = metadata.format === 'jpeg' ? 'jpg' : metadata.format;

    // Upload original
    const originalKey = `${type}/${userId}/${fileId}/original.${extension}`;
    const originalBuffer = await image.toFormat(metadata.format as any, { quality: 90 }).toBuffer();
    
    const originalUrl = await uploadFile({
      key: originalKey,
      file: originalBuffer,
      contentType: `image/${metadata.format}`,
      metadata: { userId, type },
    });

    const result: ImageUploadResult = { originalUrl };

    // Generate and upload thumbnail (150x150)
    if (type === 'profile' || type === 'logo') {
      const thumbnailKey = `${type}/${userId}/${fileId}/thumbnail.${extension}`;
      const thumbnailBuffer = await image
        .resize(150, 150, { fit: 'cover' })
        .toFormat(metadata.format as any, { quality: 80 })
        .toBuffer();

      result.thumbnailUrl = await uploadFile({
        key: thumbnailKey,
        file: thumbnailBuffer,
        contentType: `image/${metadata.format}`,
        metadata: { userId, type, size: 'thumbnail' },
      });
    }

    // Generate and upload medium size (800x800)
    const mediumKey = `${type}/${userId}/${fileId}/medium.${extension}`;
    const mediumBuffer = await image
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .toFormat(metadata.format as any, { quality: 85 })
      .toBuffer();

    result.mediumUrl = await uploadFile({
      key: mediumKey,
      file: mediumBuffer,
      contentType: `image/${metadata.format}`,
      metadata: { userId, type, size: 'medium' },
    });

    return result;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function validateImageFile(file: File): Promise<boolean> {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are supported.');
  }

  return true;
}

