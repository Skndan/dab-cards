import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { users, teamMembers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const redirectUrl = searchParams.get('state') || '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userInfoResponse.json();

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

    // Check if user belongs to an organization (team)
    const userTeamMembership = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, currentUser.id),
    });

    // Set session cookies
    await setSession(tokens.access_token, tokens.refresh_token);

    // If user doesn't have an organization, redirect to onboarding
    if (!userTeamMembership) {
      return NextResponse.redirect(new URL('/onboarding/organization', request.url));
    }

    // Redirect to original destination or dashboard
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}

