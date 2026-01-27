import { createAuthClient } from 'better-auth/react';

// Clean env vars (Vercel CLI can add trailing newlines)
const baseURL = (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000').trim();

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
