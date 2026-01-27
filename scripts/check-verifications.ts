import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  console.log('Using DATABASE_URL:', dbUrl.substring(0, 50) + '...');
  const pool = new Pool({ connectionString: dbUrl });

  try {
    // Check if verifications table exists
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'verifications';
    `);
    
    console.log('Verifications table exists:', result.rows.length > 0);
    
    // List all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('All tables:', tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
