import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { cardScans, contacts, contactEnrichments } from '@/src/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user.sub),
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '30');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Get user's cards
    const userCards = await db.query.cards.findMany({
      where: (cards, { eq }) => eq(cards.userId, user.id),
    });

    const cardIds = userCards.map((c) => c.id);

    // Total scans
    const totalScans = await db
      .select({ count: sql<number>`count(*)` })
      .from(cardScans)
      .where(
        and(
          sql`${cardScans.cardId} = ANY(${cardIds})`,
          gte(cardScans.scannedAt, startDate)
        )
      );

    // Scans by card
    const scansByCard = await db
      .select({
        cardId: cardScans.cardId,
        count: sql<number>`count(*)`,
      })
      .from(cardScans)
      .where(
        and(
          sql`${cardScans.cardId} = ANY(${cardIds})`,
          gte(cardScans.scannedAt, startDate)
        )
      )
      .groupBy(cardScans.cardId);

    // Scans by day
    const scansByDay = await db
      .select({
        date: sql<string>`DATE(${cardScans.scannedAt})`,
        count: sql<number>`count(*)`,
      })
      .from(cardScans)
      .where(
        and(
          sql`${cardScans.cardId} = ANY(${cardIds})`,
          gte(cardScans.scannedAt, startDate)
        )
      )
      .groupBy(sql`DATE(${cardScans.scannedAt})`)
      .orderBy(sql`DATE(${cardScans.scannedAt})`);

    // Scans by hour
    const scansByHour = await db
      .select({
        hour: cardScans.hourOfDay,
        count: sql<number>`count(*)`,
      })
      .from(cardScans)
      .where(
        and(
          sql`${cardScans.cardId} = ANY(${cardIds})`,
          gte(cardScans.scannedAt, startDate)
        )
      )
      .groupBy(cardScans.hourOfDay)
      .orderBy(cardScans.hourOfDay);

    // Scans by day of week
    const scansByDayOfWeek = await db
      .select({
        dayOfWeek: cardScans.dayOfWeek,
        count: sql<number>`count(*)`,
      })
      .from(cardScans)
      .where(
        and(
          sql`${cardScans.cardId} = ANY(${cardIds})`,
          gte(cardScans.scannedAt, startDate)
        )
      )
      .groupBy(cardScans.dayOfWeek)
      .orderBy(cardScans.dayOfWeek);

    return NextResponse.json({
      totalScans: totalScans[0]?.count || 0,
      scansByCard: scansByCard.map((s) => ({
        cardId: s.cardId,
        cardName: userCards.find((c) => c.id === s.cardId)?.name || 'Unknown',
        count: Number(s.count),
      })),
      scansByDay: scansByDay.map((s) => ({
        date: s.date,
        count: Number(s.count),
      })),
      scansByHour: scansByHour.map((s) => ({
        hour: s.hour,
        count: Number(s.count),
      })),
      scansByDayOfWeek: scansByDayOfWeek.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        count: Number(s.count),
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

