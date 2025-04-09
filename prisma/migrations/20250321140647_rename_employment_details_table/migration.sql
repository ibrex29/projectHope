/*
  Warnings:

  - You are about to drop the `EmployementDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployementDetails" DROP CONSTRAINT "EmployementDetails_userId_fkey";

-- DropTable
DROP TABLE "EmployementDetails";

-- CreateTable
CREATE TABLE "EmploymentDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "natureOfJob" TEXT NOT NULL,
    "annualIncome" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "employerPhoneNumber" TEXT NOT NULL,
    "employerAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmploymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentDetails_userId_key" ON "EmploymentDetails"("userId");

-- AddForeignKey
ALTER TABLE "EmploymentDetails" ADD CONSTRAINT "EmploymentDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
