'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';

/**
 * Client component that handles OAuth redirect fallback.
 * If the user completed OAuth but was redirected to the wrong page,
 * this component will detect the session and redirect to the intended destination.
 */
export function OAuthRedirectHandler() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Check if there's a pending OAuth redirect stored in sessionStorage
    const pendingRedirect = sessionStorage.getItem('admin_oauth_redirect');
    
    if (!isPending && pendingRedirect) {
      console.log('[OAUTH REDIRECT] Found pending redirect:', pendingRedirect);
      
      if (session) {
        console.log('[OAUTH REDIRECT] Session found, redirecting to:', pendingRedirect);
        sessionStorage.removeItem('admin_oauth_redirect');
        window.location.href = pendingRedirect;
      } else {
        // No session, clear the redirect and let user try again
        console.log('[OAUTH REDIRECT] No session found, clearing redirect');
        sessionStorage.removeItem('admin_oauth_redirect');
      }
    }
  }, [session, isPending]);

  // This component doesn't render anything
  return null;
}
