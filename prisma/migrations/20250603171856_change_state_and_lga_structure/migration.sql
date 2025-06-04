/*
  Warnings:

  - You are about to drop the column `localGovernmentId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the `LocalGovernment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LocalGovernment" DROP CONSTRAINT "LocalGovernment_stateId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_localGovernmentId_fkey";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "localGovernmentId",
ADD COLUMN     "localGovernment" TEXT,
ADD COLUMN     "stateOfOrigin" TEXT;

-- DropTable
DROP TABLE "LocalGovernment";

-- DropTable
DROP TABLE "State";
