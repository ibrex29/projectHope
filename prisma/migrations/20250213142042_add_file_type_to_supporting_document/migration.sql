/*
  Warnings:

  - Added the required column `fileType` to the `supporting_documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supporting_documents" ADD COLUMN     "fileType" TEXT NOT NULL;
