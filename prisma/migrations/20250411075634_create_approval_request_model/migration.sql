-- AlterTable
ALTER TABLE "action_logs" ADD COLUMN     "approvalRequestId" TEXT;

-- AlterTable
ALTER TABLE "sponsorship_requests" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canEdit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canPublish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRequestApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRequestEdit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRequestPublish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canSubmit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showEditRejectionMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showPublishRejectionMessage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "userId" TEXT,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
