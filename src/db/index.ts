import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Load environment variables
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (!connectionString) {
  console.warn('[DB] DATABASE_URL not set - database features will be unavailable');
} else {
  console.log('[DB] Initializing database connection pool');

  // Create a connection pool
  pool = new Pool({
    connectionString,
    max: 10, // Maximum number of connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Log pool events
  pool.on('connect', () => {
    console.log('[DB] New client connected to pool');
  });

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client', err);
  });

  // Create drizzle instance with schema
  dbInstance = drizzle(pool, { schema });
}

// Export db - will be null if no DATABASE_URL
export const db = dbInstance;

// Export schema for use in queries
export * from './schema';

// Helper to close the pool (useful for scripts)
export const closePool = async (): Promise<void> => {
  if (pool) {
    console.log('[DB] Closing connection pool');
    await pool.end();
    console.log('[DB] Connection pool closed');
  }
};
