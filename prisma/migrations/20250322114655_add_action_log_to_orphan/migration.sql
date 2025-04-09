-- AlterTable
ALTER TABLE "action_logs" ADD COLUMN     "orphanId" TEXT;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_orphanId_fkey" FOREIGN KEY ("orphanId") REFERENCES "orphans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
