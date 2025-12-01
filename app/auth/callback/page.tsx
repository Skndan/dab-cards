'use client';

import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function AuthCallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (auth.isLoading) return;

    console.log('Auth State:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      error: auth.error,
      hasUser: !!auth.user,
      hasAccessToken: !!auth.user?.access_token
    });

    // Handle authentication errors
    if (auth.error) {
      console.error('OIDC authentication error:', auth.error);
      console.error('Error details:', {
        message: auth.error.message,
        name: auth.error.name,
        stack: auth.error.stack
      });
      router.push('/login?error=auth_failed');
      return;
    }

    // Process successful authentication
    if (auth.isAuthenticated && auth.user?.access_token) {
      const syncUserAndRedirect = async () => {
        try {
          // Call backend API to sync user to database
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: auth.user?.access_token
            }),
          });

          if (response.ok) {
            const data = await response.json();

            // Check for custom redirect URL from login page
            const customRedirect = sessionStorage.getItem('auth_redirect');
            if (customRedirect) {
              sessionStorage.removeItem('auth_redirect');
              router.push(customRedirect);
            } else {
              // Use server-provided redirect URL based on organization status
              const redirectUrl = data.redirectUrl || '/dashboard';
              router.push(redirectUrl);
            }
          } else {
            console.error('Failed to sync user with server');
            router.push('/login?error=server_sync_failed');
          }
        } catch (error) {
          console.error('Error syncing user:', error);
          router.push('/login?error=callback_error');
        }
      };

      syncUserAndRedirect();
    }
  }, [auth, router]);

  // Show loading state
  return (
    <div className="grid h-screen place-items-center">
      <div className="text-center">
        <Loader className="mx-auto mb-4 size-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
}
