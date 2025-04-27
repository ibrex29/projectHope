/*
  Warnings:

  - You are about to drop the column `approvalRequestId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `editRequestId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `publishRequestId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the `ApprovalRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EditRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublishRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Entity" AS ENUM ('orphan', 'sponsorshipRequest');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('approval', 'edit', 'publish');

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_sponsorshipRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_sponsorshipRequestId_fkey";

-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "PublishRequest" DROP CONSTRAINT "PublishRequest_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "PublishRequest" DROP CONSTRAINT "PublishRequest_sponsorshipRequestId_fkey";

-- DropForeignKey
ALTER TABLE "PublishRequest" DROP CONSTRAINT "PublishRequest_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_approvalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_editRequestId_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_publishRequestId_fkey";

-- AlterTable
ALTER TABLE "action_logs" DROP COLUMN "approvalRequestId",
DROP COLUMN "editRequestId",
DROP COLUMN "publishRequestId",
ADD COLUMN     "actionRequestId" TEXT;

-- DropTable
DROP TABLE "ApprovalRequest";

-- DropTable
DROP TABLE "EditRequest";

-- DropTable
DROP TABLE "PublishRequest";

-- CreateTable
CREATE TABLE "ActionRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entity" "Entity" NOT NULL,
    "action" "Action" NOT NULL,
    "current" JSONB,
    "edit" JSONB,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "sponsorshipRequestId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "updatedByUserId" TEXT,

    CONSTRAINT "ActionRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_actionRequestId_fkey" FOREIGN KEY ("actionRequestId") REFERENCES "ActionRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_sponsorshipRequestId_fkey" FOREIGN KEY ("sponsorshipRequestId") REFERENCES "sponsorship_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
