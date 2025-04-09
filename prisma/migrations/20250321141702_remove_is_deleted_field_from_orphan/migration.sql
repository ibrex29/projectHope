/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `orphans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orphans" DROP COLUMN "isDeleted";
