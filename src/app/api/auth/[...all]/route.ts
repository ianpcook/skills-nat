import { getAuthInstance } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

console.log('[AUTH API] Mounting auth handler at /api/auth/*');

const authInstance = getAuthInstance();
console.log('[AUTH API] Auth instance created');
const { GET: baseGet, POST: basePost } = toNextJsHandler(authInstance);
console.log('[AUTH API] Handler created');

// Wrap handlers to log errors
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  console.log('[AUTH API] GET request:', url.pathname, url.search);
  
  try {
    const response = await baseGet(request);
    console.log('[AUTH API] GET response status:', response?.status);
    
    // Log Set-Cookie headers for debugging
    const setCookie = response?.headers?.get('set-cookie');
    if (setCookie) {
      console.log('[AUTH API] Set-Cookie header present');
    }
    
    // Log redirect location
    const location = response?.headers?.get('location');
    if (location) {
      console.log('[AUTH API] Redirect location:', location);
    }
    
    return response;
  } catch (error) {
    console.error('[AUTH API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal auth error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  console.log('[AUTH API] POST request:', url.pathname);
  
  try {
    const response = await basePost(request);
    console.log('[AUTH API] POST response status:', response?.status);
    return response;
  } catch (error) {
    console.error('[AUTH API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal auth error', message: String(error) },
      { status: 500 }
    );
  }
}
