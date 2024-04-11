ALTER TYPE "roles" ADD VALUE 'teacher';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;