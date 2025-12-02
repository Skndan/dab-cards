import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { cards } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/cards/[id] - Get a single card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {


  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  try {
    const card = await db.query.cards.findFirst({
      where: and(eq(cards.id, id), eq(cards.userId, session.user.sub)),
    });
    console.log('GET /api/cards/[id] - Query result:', card);

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      cardName,
      company,
      department,
      location,
      profileImage,
      coverImage,
      companyLogo,
      content,
      payLinks,
      theme,
      customFields,
      isActive,
    } = body;

    const [updatedCard] = await db
      .update(cards)
      .set({
        name,
        title: title ?? null,
        bio: bio ?? null,
        email: email ?? null,
        phone: phone ?? null,
        website: website ?? null,
        cardName: cardName ?? null,
        company: company ?? null,
        department: department ?? null,
        location: location ?? null,
        profileImage: profileImage ?? null,
        coverImage: coverImage ?? null,
        companyLogo: companyLogo ?? null,
        content: content ?? null,
        payLinks: payLinks ?? null,
        theme: theme ?? null,
        customFields: customFields ?? null,
        isActive: isActive ?? true,
        updatedAt: new Date(),
      })
      .where(and(eq(cards.id, id), eq(cards.userId, session.user.sub)))
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [deletedCard] = await db
      .delete(cards)
      .where(and(eq(cards.id, id), eq(cards.userId, session.user.sub)))
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

