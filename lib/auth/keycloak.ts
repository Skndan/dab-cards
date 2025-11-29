import Keycloak from 'keycloak-js';

if (!process.env.NEXT_PUBLIC_KEYCLOAK_URL) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_URL is not set');
}

if (!process.env.NEXT_PUBLIC_KEYCLOAK_REALM) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_REALM is not set');
}

if (!process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_CLIENT_ID is not set');
}

// Keycloak configuration
export const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

// Initialize Keycloak instance
export const keycloakInstance = new Keycloak(keycloakConfig);

// Server-side auth utilities
export async function verifyToken(token: string) {
  try {
    const response = await fetch(
      `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(
      `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: keycloakConfig.clientId,
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export interface KeycloakUser {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
}

