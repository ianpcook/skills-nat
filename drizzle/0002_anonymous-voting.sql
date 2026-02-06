-- Drop the foreign key constraint on user_id
ALTER TABLE "user_stars" DROP CONSTRAINT IF EXISTS "user_stars_user_id_users_id_fk";

-- Rename user_id to voter_id and change type to text
ALTER TABLE "user_stars" RENAME COLUMN "user_id" TO "voter_id";
ALTER TABLE "user_stars" ALTER COLUMN "voter_id" SET DATA TYPE text;
