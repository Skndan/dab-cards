import { env } from '@/env';

if (!env.NEXT_PUBLIC_KEYCLOAK_URL) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_URL is not set');
}

if (!env.NEXT_PUBLIC_KEYCLOAK_REALM) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_REALM is not set');
}

if (!env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_KEYCLOAK_CLIENT_ID is not set');
}

if (!env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is not set');
}

// OIDC configuration for react-oidc-context
export const oidcConfig = {
  authority: `${env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
  client_id: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  post_logout_redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/`,
  scope: 'openid email profile',
  response_type: 'code',
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Additional settings for better compatibility
  revokeAccessTokenOnSignout: true,
  includeIdTokenInSilentRenew: true,
};

