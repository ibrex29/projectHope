/*
  Warnings:

  - You are about to drop the column `canDelete` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canEdit` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canPublish` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canRequestApproval` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canRequestEdit` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canRequestPublish` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `editRequested` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `showApprovalRejectionMessage` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `showEditRejectionMessage` on the `sponsorship_requests` table. All the data in the column will be lost.
  - You are about to drop the column `showPublishRejectionMessage` on the `sponsorship_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sponsorship_requests" DROP COLUMN "canDelete",
DROP COLUMN "canEdit",
DROP COLUMN "canPublish",
DROP COLUMN "canRequestApproval",
DROP COLUMN "canRequestEdit",
DROP COLUMN "canRequestPublish",
DROP COLUMN "editRequested",
DROP COLUMN "showApprovalRejectionMessage",
DROP COLUMN "showEditRejectionMessage",
DROP COLUMN "showPublishRejectionMessage";
