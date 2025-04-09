/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `supporting_documents` table. All the data in the column will be lost.
  - Added the required column `url` to the `supporting_documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supporting_documents" DROP COLUMN "fileUrl",
ADD COLUMN     "url" TEXT NOT NULL;
