import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  pgEnum,
  index,
  customType,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom vector type for pgvector
const vector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions: number };
}>({
  dataType(config) {
    const dimensions = config?.dimensions ?? 1536;
    return `vector(${dimensions})`;
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    // pgvector returns as string like '[0.1,0.2,...]'
    return JSON.parse(value);
  },
});

// Enums
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'approved',
  'rejected',
]);

export const sourceTypeEnum = pgEnum('source_type', [
  'upload',
  'github',
]);

// Users table - publishers who can submit skills (GitHub OAuth)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: varchar('github_id', { length: 255 }).unique(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Submissions table - stores skill submissions awaiting review
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  description: text('description'),
  files: jsonb('files').$type<SubmissionFile[]>().notNull().default([]),
  repoUrl: text('repo_url'),
  status: submissionStatusEnum('status').notNull().default('pending'),
  reviewerNotes: text('reviewer_notes'),
  // Security scan results
  scanStatus: varchar('scan_status', { length: 20 }).$type<'passed' | 'flagged' | 'error'>(),
  scanResults: jsonb('scan_results'),
  scanDurationMs: integer('scan_duration_ms'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
});

// Skills table - stores approved skills
export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  files: jsonb('files').$type<SubmissionFile[]>().notNull().default([]),
  author: varchar('author', { length: 255 }),
  category: varchar('category', { length: 100 }),
  stars: integer('stars').notNull().default(0),
  agents: jsonb('agents').$type<string[]>().notNull().default([]),
  // User/ownership
  userId: uuid('user_id').references(() => users.id),
  // Source tracking (for future GitHub support)
  sourceType: sourceTypeEnum('source_type').default('upload'),
  repoUrl: text('repo_url'),
  repoPath: varchar('repo_path', { length: 500 }),
  lastSyncedAt: timestamp('last_synced_at'),
  // Submission reference
  submissionId: uuid('submission_id').references(() => submissions.id),
  approvedAt: timestamp('approved_at'),
  // Featured flag for homepage display
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Skill versions - tracks version history with changelogs
export const skillVersions = pgTable('skill_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
  version: varchar('version', { length: 50 }).notNull(),
  changelog: text('changelog'),
  files: jsonb('files').$type<SubmissionFile[]>().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Skill embeddings - for vector search (requires pgvector extension)
export const skillEmbeddings = pgTable('skill_embeddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
  embedding: vector('embedding', { dimensions: 1536 }), // text-embedding-3-small (1536 dims)
  content: text('content'), // the text that was embedded
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('skill_embeddings_skill_id_idx').on(table.skillId),
  // Note: Add HNSW or IVFFlat index for faster similarity search in production:
  // CREATE INDEX ON skill_embeddings USING hnsw (embedding vector_cosine_ops);
]);

// Skill stars/votes - anonymous voting via client-generated voter ID
export const userStars = pgTable('user_stars', {
  id: uuid('id').defaultRandom().primaryKey(),
  voterId: text('voter_id').notNull(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Admins table - stores admin users for the review system
export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  skill: one(skills, {
    fields: [submissions.id],
    references: [skills.submissionId],
  }),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  submission: one(submissions, {
    fields: [skills.submissionId],
    references: [submissions.id],
  }),
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
  versions: many(skillVersions),
  embeddings: many(skillEmbeddings),
  stars: many(userStars),
}));

export const skillVersionsRelations = relations(skillVersions, ({ one }) => ({
  skill: one(skills, {
    fields: [skillVersions.skillId],
    references: [skills.id],
  }),
}));

export const skillEmbeddingsRelations = relations(skillEmbeddings, ({ one }) => ({
  skill: one(skills, {
    fields: [skillEmbeddings.skillId],
    references: [skills.id],
  }),
}));

export const userStarsRelations = relations(userStars, ({ one }) => ({
  skill: one(skills, {
    fields: [userStars.skillId],
    references: [skills.id],
  }),
}));

// Types
export interface SubmissionFile {
  name: string;
  content: string;
  size: number;
}

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SkillVersion = typeof skillVersions.$inferSelect;
export type NewSkillVersion = typeof skillVersions.$inferInsert;
export type SkillEmbedding = typeof skillEmbeddings.$inferSelect;
export type NewSkillEmbedding = typeof skillEmbeddings.$inferInsert;
export type UserStar = typeof userStars.$inferSelect;
export type NewUserStar = typeof userStars.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type SourceType = 'upload' | 'github';
