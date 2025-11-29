import { cookies } from 'next/headers';
import { verifyToken, refreshAccessToken, type KeycloakUser } from './keycloak';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export async function getSession(): Promise<{ user: KeycloakUser; accessToken: string } | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  // Verify access token
  let user = await verifyToken(accessToken);

  // If access token is invalid, try to refresh
  if (!user && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult) {
      // Update cookies with new tokens
      cookieStore.set(ACCESS_TOKEN_COOKIE, refreshResult.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshResult.expires_in,
      });

      if (refreshResult.refresh_token) {
        cookieStore.set(REFRESH_TOKEN_COOKIE, refreshResult.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: refreshResult.refresh_expires_in,
        });
      }

      user = await verifyToken(refreshResult.access_token);
      
      if (user) {
        return {
          user,
          accessToken: refreshResult.access_token,
        };
      }
    }
  }

  if (user) {
    return {
      user,
      accessToken,
    };
  }

  return null;
}

export async function setSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

