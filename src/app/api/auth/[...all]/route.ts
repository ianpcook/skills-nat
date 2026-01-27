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
  const isCallback = url.pathname.includes('/callback/');
  
  console.log('[AUTH API] GET request:', url.pathname);
  
  if (isCallback) {
    console.log('[AUTH API] OAuth callback detected');
    console.log('[AUTH API] Query params:', Object.fromEntries(url.searchParams.entries()));
    console.log('[AUTH API] Cookies present:', request.cookies.getAll().map(c => c.name).join(', '));
  }
  
  try {
    const response = await baseGet(request);
    console.log('[AUTH API] GET response status:', response?.status);
    
    // Log Set-Cookie headers for debugging
    const setCookie = response?.headers?.get('set-cookie');
    if (setCookie) {
      console.log('[AUTH API] Set-Cookie header present, length:', setCookie.length);
      // Log cookie names being set (without values for security)
      const cookieNames = setCookie.split(',').map(c => c.split('=')[0].trim());
      console.log('[AUTH API] Cookies being set:', cookieNames);
    }
    
    // Log redirect location
    const location = response?.headers?.get('location');
    if (location) {
      console.log('[AUTH API] Redirect location:', location);
    }
    
    if (isCallback) {
      console.log('[AUTH API] Callback response headers:', Object.fromEntries(response?.headers?.entries() || []));
    }
    
    return response;
  } catch (error) {
    console.error('[AUTH API] GET error:', error);
    console.error('[AUTH API] Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal auth error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  console.log('[AUTH API] POST request:', url.pathname);
  
  // Log request body for social sign-in (for debugging callbackURL)
  if (url.pathname.includes('/sign-in/social')) {
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      console.log('[AUTH API] Sign-in social body:', JSON.stringify(body));
    } catch (e) {
      console.log('[AUTH API] Could not parse body:', e);
    }
  }
  
  try {
    const response = await basePost(request);
    console.log('[AUTH API] POST response status:', response?.status);
    
    // Log response body for sign-in to see what URL is returned
    if (url.pathname.includes('/sign-in/social') && response) {
      try {
        const clonedResponse = response.clone();
        const responseBody = await clonedResponse.text();
        console.log('[AUTH API] Sign-in social response:', responseBody.substring(0, 500));
      } catch (e) {
        console.log('[AUTH API] Could not read response body:', e);
      }
    }
    
    return response;
  } catch (error) {
    console.error('[AUTH API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal auth error', message: String(error) },
      { status: 500 }
    );
  }
}
