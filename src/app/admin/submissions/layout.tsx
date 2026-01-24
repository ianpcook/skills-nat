'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from '@/lib/auth-client';

export default function AdminSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      console.log('[ADMIN LAYOUT] No session, redirecting to login');
      router.push('/admin');
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    console.log('[ADMIN LAYOUT] Signing out');
    await signOut();
    router.push('/admin');
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Admin Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xl font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                AI@Skills
              </Link>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--primary)] font-medium">Admin</span>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="/admin/submissions"
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                Submissions
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-muted)]">
                  {session.user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
