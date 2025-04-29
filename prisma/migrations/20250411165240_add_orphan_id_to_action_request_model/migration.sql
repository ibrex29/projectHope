-- AlterTable
ALTER TABLE "ActionRequest" ADD COLUMN     "orphanId" TEXT;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_orphanId_fkey" FOREIGN KEY ("orphanId") REFERENCES "orphans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
