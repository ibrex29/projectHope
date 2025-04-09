/*
  Warnings:

  - You are about to drop the column `isAccepted` on the `orphans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orphans" DROP COLUMN "isAccepted",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'draft';
