/*
  Warnings:

  - Made the column `reason` on table `EditRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdByUserId` on table `EditRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_createdByUserId_fkey";

UPDATE "EditRequest" SET "reason" = 'No reason provided' WHERE "reason" IS NULL;

-- AlterTable
ALTER TABLE "EditRequest" ALTER COLUMN "reason" SET NOT NULL,
ALTER COLUMN "createdByUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
