/*
  Warnings:

  - The `status` column on the `EditRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EditRequest" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "action_logs" ADD COLUMN     "editRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_editRequestId_fkey" FOREIGN KEY ("editRequestId") REFERENCES "EditRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
