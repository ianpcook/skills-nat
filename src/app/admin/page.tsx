'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { signIn, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && !isPending) {
      console.log('[ADMIN LOGIN] Session found, redirecting to submissions');
      router.push('/admin/submissions');
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('[ADMIN LOGIN] Attempting login for:', email);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        console.log('[ADMIN LOGIN] Login failed:', result.error.message);
        setError(result.error.message || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('[ADMIN LOGIN] Login successful, redirecting');
      router.push('/admin/submissions');
    } catch (err) {
      console.error('[ADMIN LOGIN] Error during login:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (session) {
    return null;
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="border border-foreground/20 bg-card p-6">
          {error && (
            <div className="mb-4 border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-card-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder-foreground/40 transition-colors focus:border-foreground focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-card-foreground">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder-foreground/40 transition-colors focus:border-foreground focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

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
