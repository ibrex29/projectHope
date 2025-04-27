/*
  Warnings:

  - You are about to drop the column `actionRequestId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `actionType` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `action_logs` table. All the data in the column will be lost.
  - The `fromStatus` column on the `action_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `toStatus` column on the `action_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "action_logs" DROP COLUMN "actionRequestId",
DROP COLUMN "actionType",
DROP COLUMN "reason",
ADD COLUMN     "action" "Action",
ADD COLUMN     "change" JSONB,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "snapshot" JSONB,
DROP COLUMN "fromStatus",
ADD COLUMN     "fromStatus" "Status",
DROP COLUMN "toStatus",
ADD COLUMN     "toStatus" "Status";
