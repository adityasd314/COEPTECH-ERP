DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal3', 'aal2', 'aal1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "action" AS ENUM('ERROR', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('plain', 's256');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "equality_op" AS ENUM('in', 'gte', 'gt', 'lte', 'lt', 'neq', 'eq');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('verified', 'unverified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('webauthn', 'totp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('expired', 'invalid', 'valid', 'default');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_mis_users_mis_fk";
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "upload_date" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_date" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_date" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "date_time" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "lectures" ALTER COLUMN "date_time" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "practicals" ALTER COLUMN "date_time" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "submitted_documents" ALTER COLUMN "submission_date" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "tutorials" ALTER COLUMN "date_time" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "uploaded_documents" ALTER COLUMN "upload_date" SET DATA TYPE timestamp(6);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "mis";