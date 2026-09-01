import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import yaml from 'js-yaml';

const cliArgs = process.argv.slice(2);
const dryRun = cliArgs.includes('--dry-run');
const positionalArgs = cliArgs.filter((arg) => arg !== '--dry-run');
const skillPath = positionalArgs[0];
const repoUrl = positionalArgs[1] || null;
const repoPath = positionalArgs[2] || null;
if (!skillPath) {
  console.error('Usage: npx tsx scripts/publish-skill.ts /path/to/skill [repo-url] [repo-path] [--dry-run]');
  process.exit(1);
}

interface SkillFrontmatter {
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  category?: string;
  agents?: string[];
  metadata?: {
    version?: string;
    author?: string;
  };
}

interface SkillFile {
  name: string;
  content: string;
  size: number;
}

function readSkillFiles(root: string, relativeDir = ''): SkillFile[] {
  const currentDir = path.join(root, relativeDir);
  const files: SkillFile[] = [];

  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;

    const relativeName = path.join(relativeDir, entry.name);
    const fullPath = path.join(root, relativeName);

    if (entry.isDirectory()) {
      files.push(...readSkillFiles(root, relativeName));
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      files.push({
        name: relativeName.split(path.sep).join('/'),
        content,
        size: Buffer.byteLength(content, 'utf-8'),
      });
    }
  }

  return files;
}

async function main() {
  try {
    // Read SKILL.md
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const skillMd = fs.readFileSync(skillMdPath, 'utf-8');
    
    // Parse standards-compatible YAML frontmatter.
    const fmMatch = skillMd.match(/^---\s*\n([\s\S]*?)\n---/);
    const parsedFrontmatter = fmMatch ? yaml.load(fmMatch[1]) : {};
    const frontmatter = parsedFrontmatter && typeof parsedFrontmatter === 'object' && !Array.isArray(parsedFrontmatter)
      ? (parsedFrontmatter as SkillFrontmatter)
      : {};
    const metadata = frontmatter.metadata && typeof frontmatter.metadata === 'object'
      ? frontmatter.metadata
      : {};

    const name = typeof frontmatter.name === 'string' ? frontmatter.name : path.basename(skillPath);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const version = typeof frontmatter.version === 'string'
      ? frontmatter.version
      : typeof metadata.version === 'string' ? metadata.version : '1.0.0';
    const description = typeof frontmatter.description === 'string' ? frontmatter.description : null;
    const shortDescription = description?.slice(0, 500) || null;
    const author = typeof frontmatter.author === 'string'
      ? frontmatter.author
      : typeof metadata.author === 'string' ? metadata.author : null;
    const category = typeof frontmatter.category === 'string' ? frontmatter.category : 'Developer Tools';
    const configuredAgents = Array.isArray(frontmatter.agents)
      ? frontmatter.agents.filter((agent): agent is string => typeof agent === 'string')
      : [];
    const agents = configuredAgents.length > 0 ? configuredAgents : ['claude-code', 'codex', 'cursor'];

    const files = readSkillFiles(skillPath);

    console.log(`Publishing: ${name} (${slug}) v${version}`);
    console.log(`Files: ${files.map(f => f.name).join(', ')}`);

    if (dryRun) {
      console.log(JSON.stringify({
        name,
        slug,
        version,
        author,
        category,
        agents,
        repoUrl,
        repoPath,
        fileCount: files.length,
      }, null, 2));
      return;
    }

    const dbUrl = process.env.DATABASE_URL?.replace(/\\n/g, '');
    if (!dbUrl) throw new Error('DATABASE_URL is required unless --dry-run is used');

    const pool = new Pool({ connectionString: dbUrl });

    try {
      const id = randomUUID();
      const now = new Date().toISOString();

      const result = await pool.query(`
      INSERT INTO skills (
        id, slug, name, version, description, short_description, files,
        author, category, agents, source_type, repo_url, repo_path,
        last_synced_at, approved_at, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        version = EXCLUDED.version,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        files = EXCLUDED.files,
        author = EXCLUDED.author,
        category = EXCLUDED.category,
        agents = EXCLUDED.agents,
        source_type = EXCLUDED.source_type,
        repo_url = EXCLUDED.repo_url,
        repo_path = EXCLUDED.repo_path,
        last_synced_at = EXCLUDED.last_synced_at,
        approved_at = EXCLUDED.approved_at,
        updated_at = EXCLUDED.updated_at
      RETURNING id, slug, name
    `, [
      id,
      slug,
      name,
      version,
      description,
      shortDescription,
      JSON.stringify(files),
      author,
      category,
      JSON.stringify(agents),
      repoUrl ? 'github' : 'upload',
      repoUrl,
      repoPath,
      repoUrl ? now : null,
      now,
      now,
      now,
      ]);

      console.log(`✅ Published: ${result.rows[0].name} (${result.rows[0].slug})`);
      console.log(`   https://skillsnat.sh/skills/${slug}`);
    } finally {
      await pool.end();
    }

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
