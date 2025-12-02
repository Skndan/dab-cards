import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { cards, users } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateQRCode } from '@/lib/utils/qr';
import { uploadFile } from '@/lib/storage/rustfs';

// GET /api/cards - Get all cards for current user
export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure user exists in database (upsert)
    const [user] = await db
      .insert(users)
      .values({
        id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.preferred_username || 'Unknown User',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: session.user.email,
          name: session.user.name || session.user.preferred_username || 'Unknown User',
          updatedAt: new Date(),
        },
      })
      .returning();

    const userCards = await db.query.cards.findMany({
      where: eq(cards.userId, user.id),
      orderBy: (cards, { desc }) => [desc(cards.createdAt)],
    });

    return NextResponse.json({ cards: userCards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST /api/cards - Create a new card
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      title,
      bio,
      email,
      phone,
      website,
      content,
      payLinks,
      theme,
      customFields,
    } = body;

    // Ensure user exists in database (upsert)
    const [user] = await db
      .insert(users)
      .values({
        id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.preferred_username || 'Unknown User',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: session.user.email,
          name: session.user.name || session.user.preferred_username || 'Unknown User',
          updatedAt: new Date(),
        },
      })
      .returning();

    // Generate unique slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Generate card URL for QR code
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/card/${slug}`;

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(cardUrl, { size: 512 });

    // Convert data URL to buffer and upload to RustFS
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    const qrCodeKey = `qr-codes/${user.id}/${slug}.png`;
    const qrCodeUrl = await uploadFile({
      key: qrCodeKey,
      file: qrCodeBuffer,
      contentType: 'image/png',
    });

    // Insert card into database
    const [newCard] = await db
      .insert(cards)
      .values({
        userId: user.id,
        slug,
        name,
        title,
        bio,
        email,
        phone,
        website,
        content,
        payLinks,
        theme,
        customFields,
        qrCodeUrl,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ card: newCard }, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

