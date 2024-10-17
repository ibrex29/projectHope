/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `clothingSize` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `diseaseType` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `feedingProgram` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalName` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `mealFrequency` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `schoolAddress` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `schoolContactPerson` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `schoolContactPhone` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `schoolStatus` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `seasonalNeeds` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Need` table. All the data in the column will be lost.
  - You are about to drop the column `amountNeeded` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `amountRecieved` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `need` on the `requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Need` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amountNeeded` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Need` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestId` to the `Need` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "amountNeeded" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "amountRecieved" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Need" DROP COLUMN "cardNumber",
DROP COLUMN "clothingSize",
DROP COLUMN "diseaseType",
DROP COLUMN "feedingProgram",
DROP COLUMN "hospitalName",
DROP COLUMN "mealFrequency",
DROP COLUMN "schoolAddress",
DROP COLUMN "schoolContactPerson",
DROP COLUMN "schoolContactPhone",
DROP COLUMN "schoolName",
DROP COLUMN "schoolStatus",
DROP COLUMN "seasonalNeeds",
DROP COLUMN "type",
ADD COLUMN     "additionalInfo" JSONB,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "requestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "amountNeeded",
DROP COLUMN "amountRecieved",
DROP COLUMN "need",
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedByUserId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Need_name_key" ON "Need"("name");

-- CreateIndex
CREATE UNIQUE INDEX "requests_userId_key" ON "requests"("userId");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Need" ADD CONSTRAINT "Need_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
