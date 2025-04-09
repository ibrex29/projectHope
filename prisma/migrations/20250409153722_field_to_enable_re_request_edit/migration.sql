-- AlterTable
ALTER TABLE "EditRequest" ADD COLUMN     "originalRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_originalRequestId_fkey" FOREIGN KEY ("originalRequestId") REFERENCES "EditRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
