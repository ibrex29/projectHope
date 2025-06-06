-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Action" ADD VALUE 'request_reopen';
ALTER TYPE "Action" ADD VALUE 'approve_reopen';
ALTER TYPE "Action" ADD VALUE 'reject_reopen';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'reopen_requested';
ALTER TYPE "Status" ADD VALUE 'reopen_rejected';
ALTER TYPE "Status" ADD VALUE 'reopened';
