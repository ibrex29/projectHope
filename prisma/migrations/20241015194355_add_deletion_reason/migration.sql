-- AlterTable
ALTER TABLE "orphans" ADD COLUMN     "deletionReason" TEXT,
ADD COLUMN     "isDeleted" TEXT;
