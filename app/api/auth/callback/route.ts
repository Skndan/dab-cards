import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/keycloak';
import { db } from '@/src/db/client';
import { users, teamMembers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify token and get user info
    const userInfo = await verifyToken(token);

    if (!userInfo) {
      console.error('Failed to verify token');
      return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }

    // Create or update user in database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.keycloakId, userInfo.sub),
    });

    let currentUser;
    if (!existingUser) {
      const [newUser] = await db.insert(users).values({
        keycloakId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.preferred_username,
        avatarUrl: null,
      }).returning();
      currentUser = newUser;
    } else {
      await db.update(users)
        .set({
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
      currentUser = existingUser;
    }

    // Set session cookies for server-side access
    // Note: We might need a refresh token here if we want to keep the session alive longer
    // For now, we'll use the access token. 
    // If the client sends a refresh token, we should use that too.
    await setSession(token, '');

    // Check if user belongs to an organization (team)
    const userTeamMembership = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, currentUser.id),
    });

    // Determine redirect URL
    let redirectUrl = '/dashboard';

    // If user doesn't have an organization, redirect to onboarding
    if (!userTeamMembership) {
      redirectUrl = '/onboarding/organization';
    }

    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

