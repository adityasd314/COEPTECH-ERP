-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "booking_status" AS ENUM('cancelled', 'confirmed', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "document_status" AS ENUM('rejected', 'approved', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "performance_metrics" (
	"metric_id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(255),
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"report_id" serial PRIMARY KEY NOT NULL,
	"report_name" varchar(255) NOT NULL,
	"report_date" date,
	"report_type" varchar(100),
	"generated_by" varchar(255),
	"cloudinary_link" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"mis" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_admins" (
	"admin_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professors" (
	"professor_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"department" varchar(100),
	"position" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"professor_id" integer,
	"venue_id" integer,
	"booking_date" date,
	"start_time" "time(6)",
	"end_time" "time(6)",
	"purpose" text,
	"status" "booking_status" DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venues" (
	"venue_id" serial PRIMARY KEY NOT NULL,
	"venue_name" varchar(255) NOT NULL,
	"description" text,
	"capacity" integer,
	"location" varchar(255),
	"permission_faculty_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"department_id" serial PRIMARY KEY NOT NULL,
	"department_name" varchar(100) NOT NULL,
	"head_of_department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"course_id" serial PRIMARY KEY NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"course_code" varchar(50) NOT NULL,
	"department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "heads_of_department" (
	"hod_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"uploader_id" integer,
	"upload_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
	"venue_id" integer,
	"cloudinary_link" varchar(255),
	"status" "document_status" DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_types" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_documents" (
	"event_document_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"document_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"start_date" timestamp(6) NOT NULL,
	"end_date" timestamp(6) NOT NULL,
	"description" text,
	"created_by_user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faculty_venue_permissions" (
	"permission_id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer,
	"venue_id" integer,
	"permission_required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback" (
	"feedback_id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"session_type" varchar(20),
	"session_id" integer,
	"feedback_text" text,
	"rating" integer,
	"date_time" timestamp(6),
	"department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lectures" (
	"lecture_id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"professor_id" integer,
	"date_time" timestamp(6),
	"location" varchar(255),
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "practicals" (
	"practical_id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"professor_id" integer,
	"date_time" timestamp(6),
	"location" varchar(255),
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tutorials" (
	"tutorial_id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"professor_id" integer,
	"date_time" timestamp(6),
	"location" varchar(255),
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"student_id" serial PRIMARY KEY NOT NULL,
	"mis" varchar(50) NOT NULL,
	"department_id" integer,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "observation_checklist" (
	"checklist_id" serial PRIMARY KEY NOT NULL,
	"checklist_name" varchar(255),
	"description" text,
	"department_id" integer,
	"faculty_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submitted_documents" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"document_type_id" integer NOT NULL,
	"document_url" varchar(512) NOT NULL,
	"submission_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uploaded_documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_type_id" integer NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"upload_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
	"document_url" varchar(512) NOT NULL,
	"uploaded_by_user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_role_pkey" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_admins_user_id_key" ON "account_admins" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "document_types_document_name_key" ON "document_types" ("document_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_document_types_document_name" ON "document_types" ("document_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_event_documents_document_type_id" ON "event_documents" ("document_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_event_documents_event_id" ON "event_documents" ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_events_created_by_user_id" ON "events" ("created_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "students_mis_key" ON "students" ("mis");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submitted_documents_document_type_id" ON "submitted_documents" ("document_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submitted_documents_event_id" ON "submitted_documents" ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submitted_documents_user_id" ON "submitted_documents" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uploaded_documents_document_type_id" ON "uploaded_documents" ("document_type_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_admins" ADD CONSTRAINT "account_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venues" ADD CONSTRAINT "venues_permission_faculty_id_fkey" FOREIGN KEY ("permission_faculty_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_head_of_department_id_fkey" FOREIGN KEY ("head_of_department_id") REFERENCES "public"."heads_of_department"("hod_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "heads_of_department" ADD CONSTRAINT "fk_department_id" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_documents" ADD CONSTRAINT "event_documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_documents" ADD CONSTRAINT "event_documents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_venue_permissions" ADD CONSTRAINT "faculty_venue_permissions_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_venue_permissions" ADD CONSTRAINT "faculty_venue_permissions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."lectures"("lecture_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_fkey1" FOREIGN KEY ("session_id") REFERENCES "public"."practicals"("practical_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_fkey2" FOREIGN KEY ("session_id") REFERENCES "public"."tutorials"("tutorial_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectures" ADD CONSTRAINT "lectures_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectures" ADD CONSTRAINT "lectures_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practicals" ADD CONSTRAINT "practicals_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practicals" ADD CONSTRAINT "practicals_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students" ADD CONSTRAINT "students_mis_fkey" FOREIGN KEY ("mis") REFERENCES "public"."users"("mis") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "observation_checklist" ADD CONSTRAINT "observation_checklist_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "observation_checklist" ADD CONSTRAINT "observation_checklist_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/