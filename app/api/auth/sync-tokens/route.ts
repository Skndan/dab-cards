import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/keycloak';
import { db } from '@/src/db/client';
import { users, teamMembers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    // Verify token and get user info
    const userInfo = await verifyToken(access_token);
    
    if (!userInfo) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Create or update user in database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.keycloakId, userInfo.sub),
    });

    if (!existingUser) {
      await db.insert(users).values({
        keycloakId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.preferred_username,
        avatarUrl: null,
      });
    } else {
      await db.update(users)
        .set({
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
    }

    // Set session cookies for server-side access
    await setSession(access_token, refresh_token || '');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token sync error:', error);
    return NextResponse.json({ error: 'Failed to sync tokens' }, { status: 500 });
  }
}

