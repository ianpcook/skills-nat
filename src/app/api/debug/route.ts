import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const betterAuthUrl = process.env.BETTER_AUTH_URL || '';
  
  return NextResponse.json({
    env: {
      GOOGLE_CLIENT_ID_SET: !!clientId,
      GOOGLE_CLIENT_ID_LENGTH: clientId.length,
      GOOGLE_CLIENT_ID_ENDS_WITH_NEWLINE: clientId.endsWith('\n') || clientId.endsWith('\\n'),
      GOOGLE_CLIENT_ID_LAST_CHAR: clientId.charCodeAt(clientId.length - 1),
      GOOGLE_CLIENT_SECRET_SET: !!clientSecret,
      GOOGLE_CLIENT_SECRET_LENGTH: clientSecret.length,
      GOOGLE_CLIENT_SECRET_ENDS_WITH_NEWLINE: clientSecret.endsWith('\n') || clientSecret.endsWith('\\n'),
      GOOGLE_CLIENT_SECRET_LAST_CHAR: clientSecret.charCodeAt(clientSecret.length - 1),
      BETTER_AUTH_URL: betterAuthUrl,
      BETTER_AUTH_URL_LENGTH: betterAuthUrl.length,
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
