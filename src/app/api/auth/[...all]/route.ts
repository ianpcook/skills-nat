import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

console.log('[AUTH API] Mounting auth handler at /api/auth/*');

export const { POST, GET } = toNextJsHandler(auth);
