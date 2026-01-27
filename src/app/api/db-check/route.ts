import { db } from '@/db';
import { users, sessions, accounts } from '@/db/auth-schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }
  
  try {
    const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);
    const recentAccounts = await db.select().from(accounts).orderBy(desc(accounts.createdAt)).limit(5);
    const recentSessions = await db.select().from(sessions).orderBy(desc(sessions.createdAt)).limit(5);

    return NextResponse.json({
      users: recentUsers,
      accounts: recentAccounts,
      sessions: recentSessions
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
