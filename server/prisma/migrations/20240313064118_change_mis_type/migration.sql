/*
  Warnings:

  - The `mis` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "unique_mis";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "mis",
ADD COLUMN     "mis" INTEGER NOT NULL DEFAULT 0;
