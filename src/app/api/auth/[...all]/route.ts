import { getAuthInstance } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

console.log('[AUTH API] Mounting auth handler at /api/auth/*');

const authInstance = getAuthInstance();
console.log('[AUTH API] Auth instance created');
const handler = toNextJsHandler(authInstance);
console.log('[AUTH API] Handler created');

export const { GET, POST } = handler;
