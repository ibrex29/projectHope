/*
  Warnings:

  - You are about to drop the column `status` on the `EmployementDetails` table. All the data in the column will be lost.
  - Added the required column `employementStatus` to the `EmployementDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployementDetails" DROP COLUMN "status",
ADD COLUMN     "employementStatus" TEXT NOT NULL;
