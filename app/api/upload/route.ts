import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { uploadFile, getSignedDownloadUrl } from '@/lib/storage/rustfs';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = session.user.sub;
    const cardId = formData.get('cardId') as string;
    const imageType = formData.get('imageType') as 'profile' | 'cover' | 'logo';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'No userId provided' }, { status: 400 });
    }

    if (!cardId) {
      return NextResponse.json({ error: 'No cardId provided' }, { status: 400 });
    }

    if (!imageType) {
      return NextResponse.json({ error: 'No imageType provided' }, { status: 400 });
    }

    // Validate imageType
    if (!['profile', 'cover', 'logo'].includes(imageType)) {
      return NextResponse.json({ error: 'Invalid imageType. Must be profile, cover, or logo' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract file extension from filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    // Generate timestamp
    const timestamp = Date.now();

    // Generate RustFS key: cards/{userId}/{cardId}/{imageType}-{timestamp}.{ext}
    const key = `cards/${userId}/${cardId}/${imageType}-${timestamp}.${fileExtension}`;

    // Get content type from file
    const contentType = file.type || 'image/jpeg';

    // Upload to RustFS
    const { key: uploadedKey } = await uploadFile({
      key,
      file: buffer,
      contentType,
      metadata: {
        userId,
        cardId,
        imageType,
        originalName: file.name,
      },
    });

    // Generate signed URL for immediate preview
    const signedUrl = await getSignedDownloadUrl(uploadedKey);

    return NextResponse.json({
      key: uploadedKey,
      url: signedUrl
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

