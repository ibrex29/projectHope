/*
  Warnings:

  - The `status` column on the `sponsorship_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "sponsorship_requests" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'draft';
