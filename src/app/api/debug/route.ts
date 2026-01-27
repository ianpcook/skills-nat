import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      GOOGLE_CLIENT_ID_SET: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET_SET: !!process.env.GOOGLE_CLIENT_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}

export async function POST(request: Request) {
  // Test if we can create the social sign-in URL
  try {
    const body = await request.json();
    
    // Try calling the auth social sign-in directly
    const { getAuthInstance } = await import('@/lib/auth');
    const auth = getAuthInstance();
    
    // Log what we have
    console.log('[DEBUG] Auth instance:', Object.keys(auth));
    
    return NextResponse.json({
      body,
      authKeys: Object.keys(auth),
      message: 'Check server logs for details'
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      stack: (error as Error).stack
    }, { status: 500 });
  }
}
