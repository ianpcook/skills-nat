/**
 * Seed script to create a default admin user
 * Run with: npx tsx scripts/seed-admin.ts
 */

import 'dotenv/config';
import { db, closePool } from '../src/db';
import { auth } from '../src/lib/auth';

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'changeme123';

async function seedAdmin() {
  console.log('[SEED] Starting admin seed script');
  console.log(`[SEED] Creating admin user: ${DEFAULT_ADMIN_EMAIL}`);

  try {
    // Use better-auth's signUp to create the admin user
    // This ensures the password is properly hashed
    const result = await auth.api.signUpEmail({
      body: {
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        name: 'Admin',
      },
    });

    if (result.user) {
      console.log(`[SEED] Admin user created successfully`);
      console.log(`[SEED] User ID: ${result.user.id}`);
      console.log(`[SEED] Email: ${result.user.email}`);
    } else {
      console.log('[SEED] Admin user may already exist or creation was skipped');
    }

    console.log('\n[SEED] Default admin credentials:');
    console.log(`  Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`  Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('\n[SEED] Please change the password after first login!');

  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('[SEED] Admin user already exists, skipping creation');
    } else {
      console.error('[SEED] Error creating admin user:', error);
      process.exit(1);
    }
  } finally {
    await closePool();
    console.log('[SEED] Done');
  }
}

seedAdmin();
