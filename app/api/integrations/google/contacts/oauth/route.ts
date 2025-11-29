import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/integrations/google-contacts';
import { db } from '@/src/db/client';
import { integrations, users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // userId

  if (!code || !state) {
    return NextResponse.redirect(new URL('/integrations?error=invalid_request', request.url));
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    const user = await db.query.users.findFirst({
      where: eq(users.keycloakId, state),
    });

    if (!user) {
      return NextResponse.redirect(new URL('/integrations?error=user_not_found', request.url));
    }

    // Save integration
    await db.insert(integrations).values({
      userId: user.id,
      type: 'google_contacts',
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      isActive: true,
    }).onConflictDoUpdate({
      target: [integrations.userId, integrations.type],
      set: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token || null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL('/integrations?success=google_contacts', request.url));
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/integrations?error=oauth_failed', request.url));
  }
}

