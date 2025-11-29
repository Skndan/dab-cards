import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/client';
import { contacts, cardScans } from '@/src/db/schema';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cardId = formData.get('cardId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!cardId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get card to find user ID
    const card = await db.query.cards.findFirst({
      where: (cards, { eq }) => eq(cards.id, cardId),
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Create contact
    const [newContact] = await db
      .insert(contacts)
      .values({
        userId: card.userId,
        sourceCardId: cardId,
        name,
        email,
        phone: phone || null,
        notes: message || null,
      })
      .returning();

    // Track card scan
    await db.insert(cardScans).values({
      cardId,
      contactId: newContact.id,
      scannedAt: new Date(),
    });

    // TODO: Trigger AI enrichment job here
    // enqueueJob('enrichContact', { contactId: newContact.id });

    return NextResponse.json({ success: true, contactId: newContact.id }, { status: 201 });
  } catch (error) {
    console.error('Contact capture error:', error);
    return NextResponse.json({ error: 'Failed to capture contact' }, { status: 500 });
  }
}

