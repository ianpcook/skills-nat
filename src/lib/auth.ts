import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';

let authInstance: ReturnType<typeof betterAuth> | null = null;

function getAuth() {
  if (authInstance) return authInstance;

  if (!db) {
    throw new Error('Database not available - cannot initialize auth');
  }

  console.log('[AUTH] Initializing better-auth');

  authInstance = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    trustedOrigins: [
      process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    ],
  });

  console.log('[AUTH] better-auth initialized successfully');
  return authInstance;
}

// Export auth as a getter that initializes on first access
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    const instance = getAuth();
    return (instance as Record<string, unknown>)[prop as string];
  },
});

// Export auth types - use a placeholder type since we can't infer from lazy instance
export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
export type User = {
  id: string;
  email: string;
  name?: string;
};
