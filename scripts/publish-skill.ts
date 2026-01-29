import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const skillPath = process.argv[2];
if (!skillPath) {
  console.error('Usage: npx tsx scripts/publish-skill.ts /path/to/skill');
  process.exit(1);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL?.replace(/\\n/g, '');
  if (!dbUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    // Read SKILL.md
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const skillMd = fs.readFileSync(skillMdPath, 'utf-8');
    
    // Parse frontmatter
    const fmMatch = skillMd.match(/^---\s*\n([\s\S]*?)\n---/);
    const frontmatter: Record<string, string> = {};
    if (fmMatch) {
      for (const line of fmMatch[1].split('\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const key = line.slice(0, colonIdx).trim();
          let val = line.slice(colonIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          frontmatter[key] = val;
        }
      }
    }

    const name = frontmatter.name || path.basename(skillPath);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const version = frontmatter.version || '1.0.0';
    const description = frontmatter.description || null;

    // Read all files
    const files: { name: string; content: string; size: number }[] = [];
    for (const fname of fs.readdirSync(skillPath)) {
      const fpath = path.join(skillPath, fname);
      const stat = fs.statSync(fpath);
      if (stat.isFile() && !fname.startsWith('.')) {
        const content = fs.readFileSync(fpath, 'utf-8');
        files.push({ name: fname, content, size: content.length });
      }
    }

    console.log(`Publishing: ${name} (${slug}) v${version}`);
    console.log(`Files: ${files.map(f => f.name).join(', ')}`);

    const id = randomUUID();
    const now = new Date().toISOString();

    // Insert skill with correct column names
    const result = await pool.query(`
      INSERT INTO skills (
        id, slug, name, version, description, files, 
        source_type, approved_at, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        version = EXCLUDED.version,
        description = EXCLUDED.description,
        files = EXCLUDED.files,
        updated_at = EXCLUDED.updated_at
      RETURNING id, slug, name
    `, [id, slug, name, version, description, JSON.stringify(files), 'upload', now, now, now]);

    console.log(`✅ Published: ${result.rows[0].name} (${result.rows[0].slug})`);
    console.log(`   https://skills-nat.vercel.app/skills/${slug}`);

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
