import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Load environment variables
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('[DB] DATABASE_URL environment variable is not set');
  throw new Error('DATABASE_URL environment variable is required');
}

console.log('[DB] Initializing database connection pool');

// Create a connection pool
const pool = new Pool({
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
export const db = drizzle(pool, { schema });

// Export schema for use in queries
export * from './schema';

// Helper to close the pool (useful for scripts)
export const closePool = async (): Promise<void> => {
  console.log('[DB] Closing connection pool');
  await pool.end();
  console.log('[DB] Connection pool closed');
};
