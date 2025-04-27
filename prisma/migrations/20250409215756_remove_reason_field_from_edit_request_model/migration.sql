/*
  Warnings:

  - You are about to drop the column `originalRequestId` on the `EditRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `EditRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_originalRequestId_fkey";

-- AlterTable
ALTER TABLE "EditRequest" DROP COLUMN "originalRequestId",
DROP COLUMN "reason";
