-- AlterTable
ALTER TABLE "sponsorship_requests" ADD COLUMN     "canEdit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canPublish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRequestEdit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRequestPublish" BOOLEAN NOT NULL DEFAULT false;
