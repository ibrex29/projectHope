/*
  Warnings:

  - Made the column `employmentStatus` on table `EmployementDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployementDetails" ALTER COLUMN "employmentStatus" SET NOT NULL;
