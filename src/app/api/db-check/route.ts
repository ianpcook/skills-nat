import { db } from '@/db';
import { users, sessions, accounts } from '@/db/auth-schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const recentUsers = await db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt)).limit(5);

    const recentAccounts = await db.select({
      id: accounts.id,
      providerId: accounts.providerId,
      userId: accounts.userId,
      createdAt: accounts.createdAt
    }).from(accounts).orderBy(desc(accounts.createdAt)).limit(5);

    const recentSessions = await db.select({
      id: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      createdAt: sessions.createdAt
    }).from(sessions).orderBy(desc(sessions.createdAt)).limit(5);

    return NextResponse.json({
      users: recentUsers,
      accounts: recentAccounts,
      sessions: recentSessions
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
