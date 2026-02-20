'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Mail, Github, Loader2, Check, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/submit';

  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    setError(null);
    setIsLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(null);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsLoading('magic-link');
    try {
      await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: callbackUrl,
      });
      setMagicLinkSent(true);
    } catch {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-pop-lime shadow-[4px_4px_0_0_theme(colors.foreground)]">
          <Check className="h-10 w-10 text-foreground" />
        </div>
        <h2 className="text-2xl font-black uppercase text-foreground mb-4">Check Your Email</h2>
        <p className="text-muted-foreground mb-2">
          We sent a sign-in link to <strong className="text-foreground">{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Click the link in the email to sign in. It expires in 10 minutes.
        </p>
        <Button
          variant="outline"
          className="border-3 border-foreground font-bold uppercase shadow-[3px_3px_0_0_theme(colors.foreground)] hover:shadow-[1px_1px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          onClick={() => {
            setMagicLinkSent(false);
            setEmail('');
          }}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <div className="space-y-3">
        {/* Google */}
        <Button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={isLoading !== null}
          className="w-full py-5 bg-card text-foreground font-bold uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.pop-pink)] hover:shadow-[2px_2px_0_0_theme(colors.pop-pink)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {isLoading === 'google' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Sign in with Google
        </Button>

        {/* GitHub */}
        <Button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={isLoading !== null}
          className="w-full py-5 bg-foreground text-card font-bold uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.pop-cyan)] hover:shadow-[2px_2px_0_0_theme(colors.pop-cyan)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {isLoading === 'github' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Github className="mr-2 h-5 w-5" />
          )}
          Sign in with GitHub
        </Button>

        {/* Apple */}
        <Button
          type="button"
          onClick={() => handleOAuth('apple')}
          disabled={isLoading !== null}
          className="w-full py-5 bg-card text-foreground font-bold uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.pop-orange)] hover:shadow-[2px_2px_0_0_theme(colors.pop-orange)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {isLoading === 'apple' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          )}
          Sign in with Apple
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-1 flex-1 bg-foreground" />
        <span className="font-black uppercase text-sm text-foreground">or</span>
        <div className="h-1 flex-1 bg-foreground" />
      </div>

      {/* Magic Link */}
      <form onSubmit={handleMagicLink} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-bold uppercase text-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 border-3 border-foreground bg-card text-foreground font-bold placeholder:text-foreground/30 focus:outline-none focus:ring-0 focus:border-pop-pink transition-colors"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading !== null || !email.trim()}
          className="w-full py-5 bg-pop-lime text-foreground font-black uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {isLoading === 'magic-link' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Mail className="mr-2 h-5 w-5" />
          )}
          Send Magic Link
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="border-3 border-foreground bg-pop-pink p-4 text-sm font-bold text-foreground">
          {error}
        </div>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-foreground hover:text-pop-pink mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Card */}
          <div className="border-4 border-foreground bg-card p-8 shadow-[6px_6px_0_0_theme(colors.foreground)]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black uppercase">
                <span className="text-pop-orange">Sign</span> In
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Sign in to submit and manage your skills
              </p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
