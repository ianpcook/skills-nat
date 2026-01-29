'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogOut, FileText } from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="logo-box">
                <span>Skills N'at</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground">Admin</span>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="/admin/submissions"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <FileText className="h-4 w-4" />
                Submissions
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="btn-outline gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
