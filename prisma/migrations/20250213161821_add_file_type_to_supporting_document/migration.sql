/*
  Warnings:

  - You are about to drop the column `filename` on the `supporting_documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "supporting_documents" DROP COLUMN "filename",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
