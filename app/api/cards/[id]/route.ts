import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { cards } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/cards/[id] - Get a single card
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const card = await db.query.cards.findFirst({
      where: and(eq(cards.id, params.id), eq(cards.userId, session.user.sub)),
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ card });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

// PUT /api/cards/[id] - Update a card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      profilePicture,
      bannerImage,
      logoImage,
      socialLinks,
      payLinks,
      theme,
      customFields,
      isActive,
    } = body;

    const [updatedCard] = await db
      .update(cards)
      .set({
        name,
        title,
        bio,
        email,
        phone,
        website,
        profilePicture,
        bannerImage,
        logoImage,
        socialLinks,
        payLinks,
        theme,
        customFields,
        isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(cards.id, params.id), eq(cards.userId, session.user.sub)))
      .returning();

    if (!updatedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ card: updatedCard });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE /api/cards/[id] - Delete a card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [deletedCard] = await db
      .delete(cards)
      .where(and(eq(cards.id, params.id), eq(cards.userId, session.user.sub)))
      .returning();

    if (!deletedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

