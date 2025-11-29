import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';

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

    const logoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}`;

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

