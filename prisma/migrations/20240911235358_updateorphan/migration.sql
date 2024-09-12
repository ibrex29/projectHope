/*
  Warnings:

  - You are about to drop the column `status` on the `orphans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orphans" DROP COLUMN "status",
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;
