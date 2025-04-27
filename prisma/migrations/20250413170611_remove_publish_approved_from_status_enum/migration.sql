/*
  Warnings:

  - The values [publish_approved] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'deleted', 'closed', 'published', 'reopened', 'approval_requested', 'edit_requested', 'publish_requested', 'approval_rejected', 'edit_rejected', 'publish_rejected', 'edit_approved', 'reopen_requested', 'reopen_rejected', 'reopen_publish_requested', 'reopen_publish_rejected');
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
