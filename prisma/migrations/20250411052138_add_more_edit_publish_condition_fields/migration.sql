-- AlterTable
ALTER TABLE "sponsorship_requests" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canSubmit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showEditRejectionMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showPublishRejectionMessage" BOOLEAN NOT NULL DEFAULT false;
