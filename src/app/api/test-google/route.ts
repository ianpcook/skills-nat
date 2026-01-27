import { NextResponse } from 'next/server';
import { getAuthInstance } from '@/lib/auth';

export async function GET() {
  try {
    const auth = getAuthInstance();
    
    // Check what methods are available on auth and auth.api
    const methods = Object.keys(auth);
    const apiMethods = auth.api ? Object.keys(auth.api) : [];
    
    return NextResponse.json({
      authMethods: methods,
      apiMethods: apiMethods.slice(0, 50), // Limit output
      env: {
        GOOGLE_CLIENT_ID_SET: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET_SET: !!process.env.GOOGLE_CLIENT_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      }
    });
  } catch (e) {
    return NextResponse.json({
      topLevelError: e instanceof Error ? { message: e.message, stack: e.stack } : String(e)
    }, { status: 500 });
  }
}
