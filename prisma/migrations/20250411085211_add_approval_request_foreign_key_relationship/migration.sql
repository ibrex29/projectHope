-- AlterTable
ALTER TABLE "ApprovalRequest" ADD COLUMN     "sponsorshipRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_sponsorshipRequestId_fkey" FOREIGN KEY ("sponsorshipRequestId") REFERENCES "sponsorship_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
