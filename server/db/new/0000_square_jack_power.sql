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
 CREATE TYPE "booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'withdrawn');
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
 CREATE TYPE "document_status" AS ENUM('pending', 'approved', 'rejected', 'withdrawn');
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
DO $$ BEGIN
 CREATE TYPE "roles" AS ENUM('admin', 'teacher', 'student');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_admins" (
	"admin_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"professor_id" integer,
	"venue_id" integer,
	"booking_date" date,
	"start_time" time,
	"end_time" time,
	"purpose" text,
	"status" "booking_status" DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"course_id" serial PRIMARY KEY NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"course_code" varchar(50) NOT NULL,
	"department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"department_id" serial PRIMARY KEY NOT NULL,
	"department_name" varchar(100) NOT NULL,
	"head_of_department_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_types" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"uploader_id" integer,
	"upload_date" timestamp(6) DEFAULT now(),
	"venue_id" integer,
	"cloudinary_link" varchar(255),
	"status" "document_status" DEFAULT 'pending'
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
CREATE TABLE IF NOT EXISTS "heads_of_department" (
	"hod_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
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
CREATE TABLE IF NOT EXISTS "observation_checklist" (
	"checklist_id" serial PRIMARY KEY NOT NULL,
	"checklist_name" varchar(255),
	"description" text,
	"department_id" integer,
	"faculty_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "performance_metrics" (
	"metric_id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(255),
	"description" text
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
CREATE TABLE IF NOT EXISTS "professors" (
	"professor_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"department" varchar(100),
	"position" varchar(100)
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
CREATE TABLE IF NOT EXISTS "students" (
	"student_id" serial PRIMARY KEY NOT NULL,
	"mis" varchar(50) NOT NULL,
	"department_id" integer,
	"year" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submitted_documents" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"document_type_id" integer NOT NULL,
	"document_url" varchar(512) NOT NULL,
	"submission_date" timestamp(6) DEFAULT now()
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
CREATE TABLE IF NOT EXISTS "uploaded_documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"document_type_id" integer NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"upload_date" timestamp(6) DEFAULT now(),
	"document_url" varchar(512) NOT NULL,
	"uploaded_by_user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"role_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255) NOT NULL,
	"role" "roles" NOT NULL
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
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_admins" ADD CONSTRAINT "account_admins_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_professor_id_professors_professor_id_fk" FOREIGN KEY ("professor_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_head_of_department_id_heads_of_department_hod_id_fk" FOREIGN KEY ("head_of_department_id") REFERENCES "heads_of_department"("hod_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_uploader_id_professors_professor_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_documents" ADD CONSTRAINT "event_documents_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_documents" ADD CONSTRAINT "event_documents_document_type_id_document_types_document_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_created_by_user_id_users_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_venue_permissions" ADD CONSTRAINT "faculty_venue_permissions_faculty_id_professors_professor_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_venue_permissions" ADD CONSTRAINT "faculty_venue_permissions_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_lectures_lecture_id_fk" FOREIGN KEY ("session_id") REFERENCES "lectures"("lecture_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_practicals_practical_id_fk" FOREIGN KEY ("session_id") REFERENCES "practicals"("practical_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_session_id_tutorials_tutorial_id_fk" FOREIGN KEY ("session_id") REFERENCES "tutorials"("tutorial_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "heads_of_department" ADD CONSTRAINT "heads_of_department_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectures" ADD CONSTRAINT "lectures_course_id_courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectures" ADD CONSTRAINT "lectures_professor_id_professors_professor_id_fk" FOREIGN KEY ("professor_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "observation_checklist" ADD CONSTRAINT "observation_checklist_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "observation_checklist" ADD CONSTRAINT "observation_checklist_faculty_id_professors_professor_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practicals" ADD CONSTRAINT "practicals_course_id_courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practicals" ADD CONSTRAINT "practicals_professor_id_professors_professor_id_fk" FOREIGN KEY ("professor_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submitted_documents" ADD CONSTRAINT "submitted_documents_document_type_id_document_types_document_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_course_id_courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_professor_id_professors_professor_id_fk" FOREIGN KEY ("professor_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_document_type_id_document_types_document_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_uploaded_by_user_id_users_user_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venues" ADD CONSTRAINT "venues_permission_faculty_id_professors_professor_id_fk" FOREIGN KEY ("permission_faculty_id") REFERENCES "professors"("professor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
