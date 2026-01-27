'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, ShieldX } from 'lucide-react';
import { signIn, signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Check for pending OAuth redirect (fallback if callbackURL wasn't preserved)
  useEffect(() => {
    const pendingRedirect = sessionStorage.getItem('admin_oauth_redirect');
    if (pendingRedirect && window.location.pathname === '/') {
      console.log('[ADMIN LOGIN] Found pending redirect, checking session...');
      sessionStorage.removeItem('admin_oauth_redirect');
      // Redirect to admin to check session there
      window.location.href = '/admin';
    }
  }, []);

  // Debug: Log session state and call session API directly
  useEffect(() => {
    console.log('[ADMIN LOGIN] Session state:', { session, isPending });
    console.log('[ADMIN LOGIN] Document cookies (non-httpOnly):', document.cookie);
    
    // Also call the session API directly to see what we get
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => console.log('[ADMIN LOGIN] Direct session API call:', data))
      .catch(err => console.error('[ADMIN LOGIN] Session API error:', err));
  }, [session, isPending]);

  // Check admin access when session is available
  useEffect(() => {
    async function checkAdminAccess() {
      console.log('[ADMIN LOGIN] checkAdminAccess called', { session: !!session, isPending });
      if (session && !isPending) {
        setCheckingAdmin(true);
        try {
          // Check if user is an admin by hitting the admin API
          console.log('[ADMIN LOGIN] Calling /api/admin/check');
          const res = await fetch('/api/admin/check');
          const data = await res.json();
          console.log('[ADMIN LOGIN] Admin check response:', res.status, data);
          
          if (res.ok) {
            console.log('[ADMIN LOGIN] Admin access confirmed, redirecting');
            router.push('/admin/submissions');
          } else {
            console.log('[ADMIN LOGIN] Access denied - not an admin');
            setAccessDenied(true);
          }
        } catch (err) {
          console.error('[ADMIN LOGIN] Error checking admin status:', err);
          setError('Failed to verify admin access');
        } finally {
          setCheckingAdmin(false);
        }
      }
    }
    checkAdminAccess();
  }, [session, isPending, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      // Store the intended destination in sessionStorage before OAuth
      // This is a fallback in case the callbackURL isn't preserved
      sessionStorage.setItem('admin_oauth_redirect', '/admin');
      
      // Use the full URL for callbackURL to ensure proper redirect
      const callbackURL = `${window.location.origin}/admin`;
      console.log('[ADMIN LOGIN] Starting OAuth with callbackURL:', callbackURL);
      
      // Don't use fetchOptions callbacks - let better-auth handle redirect automatically
      // Setting disableRedirect: false (default) will auto-redirect to Google
      const result = await signIn.social({
        provider: 'google',
        callbackURL,
      });
      
      console.log('[ADMIN LOGIN] signIn.social returned:', result);
      
      // If signIn.social returned a URL (disableRedirect wasn't triggered), redirect manually
      if (result?.data && typeof result.data === 'object' && 'url' in result.data) {
        console.log('[ADMIN LOGIN] Redirecting to OAuth URL:', result.data.url);
        window.location.href = result.data.url as string;
        return;
      }
      
      // If we get here without a redirect, check for errors
      if (result?.error) {
        console.error('[ADMIN LOGIN] OAuth error:', result.error);
        setError(result.error.message || 'Sign-in failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('[ADMIN LOGIN] Google sign-in error:', err);
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAccessDenied(false);
    setError(null);
  };

  if (isPending || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-foreground" />
          <p className="mt-4 text-foreground/70">
            {checkingAdmin ? 'Verifying admin access...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (accessDenied && session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <ShieldX className="mx-auto h-16 w-16 text-destructive mb-6" />
          <h1 className="section-title mb-4">Access Denied</h1>
          <p className="text-foreground/70 mb-2">
            Signed in as <strong>{session.user?.email}</strong>
          </p>
          <p className="text-foreground/70 mb-6">
            This account does not have admin privileges.
          </p>
          <div className="space-y-3">
            <Button onClick={handleSignOut} className="btn-primary w-full py-3">
              Sign Out & Try Different Account
            </Button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="logo-box mx-auto mb-6 inline-block">
            <span>AI@Skills</span>
          </div>
          <h1 className="section-title mb-2">Admin Login</h1>
          <p className="text-foreground/70">Sign in to review skill submissions</p>
        </div>

        {/* Sign In Box */}
        <div className="border border-foreground/20 bg-card p-6">
          {error && (
            <div className="mb-4 border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-foreground/50">
            Only authorized administrators can access this area.
          </p>
        </div>

        {/* Back Link */}
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
