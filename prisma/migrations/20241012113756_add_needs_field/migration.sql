/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedByUserId` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_updatedByUserId_fkey";

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isDeleted" TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "createdByUserId",
DROP COLUMN "updatedByUserId";
