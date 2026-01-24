import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'approved',
  'rejected',
]);

// Submissions table - stores skill submissions awaiting review
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  description: text('description'),
  files: jsonb('files').$type<SubmissionFile[]>().notNull().default([]),
  status: submissionStatusEnum('status').notNull().default('pending'),
  reviewerNotes: text('reviewer_notes'),
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
  submissionId: uuid('submission_id').references(() => submissions.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Admins table - stores admin users for the review system
export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const submissionsRelations = relations(submissions, ({ one }) => ({
  skill: one(skills, {
    fields: [submissions.id],
    references: [skills.submissionId],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  submission: one(submissions, {
    fields: [skills.submissionId],
    references: [submissions.id],
  }),
}));

// Types
export interface SubmissionFile {
  name: string;
  content: string;
  size: number;
}

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
