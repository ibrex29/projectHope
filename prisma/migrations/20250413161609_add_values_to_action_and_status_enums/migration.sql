/*
  Warnings:

  - The values [reopened] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Action" ADD VALUE 'request_reopen_publish';
ALTER TYPE "Action" ADD VALUE 'approve_reopen_publish';
ALTER TYPE "Action" ADD VALUE 'reject_reopen_publish';

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'deleted', 'closed', 'published', 'reopend', 'approval_requested', 'edit_requested', 'publish_requested', 'approval_rejected', 'edit_rejected', 'publish_rejected', 'edit_approved', 'publish_approved', 'reopen_requested', 'reopen_rejected', 'reopen_approved', 'reopen_publish_requested', 'reopen_publish_rejected');
ALTER TABLE "orphans" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "sponsorship_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orphans" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "sponsorship_requests" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "action_logs" ALTER COLUMN "fromStatus" TYPE "Status_new" USING ("fromStatus"::text::"Status_new");
ALTER TABLE "action_logs" ALTER COLUMN "toStatus" TYPE "Status_new" USING ("toStatus"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "orphans" ALTER COLUMN "status" SET DEFAULT 'draft';
ALTER TABLE "sponsorship_requests" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
