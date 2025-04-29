/*
  Warnings:

  - The values [approval] on the enum `Action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Action_new" AS ENUM ('create', 'edit', 'delete', 'approve', 'publish', 'request_approval', 'request_edit', 'request_publish');
ALTER TABLE "action_logs" ALTER COLUMN "action" TYPE "Action_new" USING ("action"::text::"Action_new");
ALTER TYPE "Action" RENAME TO "Action_old";
ALTER TYPE "Action_new" RENAME TO "Action";
DROP TYPE "Action_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'closed';
ALTER TYPE "Status" ADD VALUE 'published';
ALTER TYPE "Status" ADD VALUE 'approval_requested';
ALTER TYPE "Status" ADD VALUE 'edit_requested';
ALTER TYPE "Status" ADD VALUE 'publish_requested';
ALTER TYPE "Status" ADD VALUE 'approval_rejected';
ALTER TYPE "Status" ADD VALUE 'edit_rejected';
ALTER TYPE "Status" ADD VALUE 'publish_rejected';
