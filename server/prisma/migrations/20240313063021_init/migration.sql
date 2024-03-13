-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'STUDENT', 'FACULTY', 'HOSTEL_ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "mis" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_role" "user_role" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_mis" ON "user"("mis");
