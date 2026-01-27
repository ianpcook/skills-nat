import * as dotenv from 'dotenv';
import { Pool } from 'pg';

// Load .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('Creating verifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY NOT NULL,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('Creating index...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS verifications_identifier_idx 
      ON verifications USING btree (identifier);
    `);

    console.log('Done!');
    
    // Verify the table exists
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'verifications';
    `);
    console.log('Table columns:', result.rows);

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
