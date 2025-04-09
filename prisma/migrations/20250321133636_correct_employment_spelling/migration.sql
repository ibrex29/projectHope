/*
  Warnings:

  - You are about to drop the column `employementStatus` on the `EmployementDetails` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `orphans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployementDetails" DROP COLUMN "employementStatus",
ADD COLUMN     "employmentStatus" TEXT;

-- AlterTable
ALTER TABLE "orphans" DROP COLUMN "trackingNumber";
