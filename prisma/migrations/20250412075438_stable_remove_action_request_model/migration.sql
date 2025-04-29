/*
  Warnings:

  - You are about to drop the `ActionRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActionRequest" DROP CONSTRAINT "ActionRequest_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ActionRequest" DROP CONSTRAINT "ActionRequest_orphanId_fkey";

-- DropForeignKey
ALTER TABLE "ActionRequest" DROP CONSTRAINT "ActionRequest_sponsorshipRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ActionRequest" DROP CONSTRAINT "ActionRequest_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_actionRequestId_fkey";

-- DropTable
DROP TABLE "ActionRequest";
