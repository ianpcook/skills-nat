import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }
  
  try {
    const usersResult = await db.execute(sql`SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 5`);
    const accountsResult = await db.execute(sql`SELECT id, provider_id, user_id, created_at FROM accounts ORDER BY created_at DESC LIMIT 5`);
    const sessionsResult = await db.execute(sql`SELECT id, user_id, expires_at, created_at FROM sessions ORDER BY created_at DESC LIMIT 5`);

    return NextResponse.json({
      users: usersResult.rows,
      accounts: accountsResult.rows,
      sessions: sessionsResult.rows
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
