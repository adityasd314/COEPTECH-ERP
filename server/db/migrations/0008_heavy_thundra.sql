ALTER TABLE "bookings" ALTER COLUMN "start_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "end_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "upload_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "date_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "lectures" ALTER COLUMN "date_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "practicals" ALTER COLUMN "date_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "submitted_documents" ALTER COLUMN "submission_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "tutorials" ALTER COLUMN "date_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "uploaded_documents" ALTER COLUMN "upload_date" SET DATA TYPE timestamp;