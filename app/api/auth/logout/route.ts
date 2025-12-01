import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';
import { env } from '@/env';

export async function POST(request: NextRequest) {
  try {
    // Clear session cookies
    await clearSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await clearSession();

    // OIDC logout URL (Keycloak)
    const logoutUrl = `${env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(env.NEXT_PUBLIC_APP_URL)}`;

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

