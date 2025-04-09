-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_sponsorshipRequestId_fkey";

-- AlterTable
ALTER TABLE "action_logs" ALTER COLUMN "sponsorshipRequestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_sponsorshipRequestId_fkey" FOREIGN KEY ("sponsorshipRequestId") REFERENCES "sponsorship_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
