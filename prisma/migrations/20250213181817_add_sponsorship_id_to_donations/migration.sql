/*
  Warnings:

  - A unique constraint covering the columns `[transactionReference]` on the table `DonationRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sponsorshipId` to the `DonationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SponsorshipRequestDonations" DROP CONSTRAINT "_SponsorshipRequestDonations_A_fkey";

-- AlterTable
ALTER TABLE "DonationRequest" ADD COLUMN     "paymentGateway" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "sponsorshipId" TEXT NOT NULL,
ADD COLUMN     "transactionReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DonationRequest_transactionReference_key" ON "DonationRequest"("transactionReference");

-- AddForeignKey
ALTER TABLE "DonationRequest" ADD CONSTRAINT "DonationRequest_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorship_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorshipRequestDonations" ADD CONSTRAINT "_SponsorshipRequestDonations_A_fkey" FOREIGN KEY ("A") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
