-- CreateTable
CREATE TABLE "sponsorship_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "amountReceived" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "supportingDocuments" TEXT[],
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,

    CONSTRAINT "sponsorship_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SponsorshipRequestOrphans" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SponsorshipRequestDonations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SponsorshipRequestOrphans_AB_unique" ON "_SponsorshipRequestOrphans"("A", "B");

-- CreateIndex
CREATE INDEX "_SponsorshipRequestOrphans_B_index" ON "_SponsorshipRequestOrphans"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SponsorshipRequestDonations_AB_unique" ON "_SponsorshipRequestDonations"("A", "B");

-- CreateIndex
CREATE INDEX "_SponsorshipRequestDonations_B_index" ON "_SponsorshipRequestDonations"("B");

-- AddForeignKey
ALTER TABLE "sponsorship_requests" ADD CONSTRAINT "sponsorship_requests_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_requests" ADD CONSTRAINT "sponsorship_requests_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorshipRequestOrphans" ADD CONSTRAINT "_SponsorshipRequestOrphans_A_fkey" FOREIGN KEY ("A") REFERENCES "orphans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorshipRequestOrphans" ADD CONSTRAINT "_SponsorshipRequestOrphans_B_fkey" FOREIGN KEY ("B") REFERENCES "sponsorship_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorshipRequestDonations" ADD CONSTRAINT "_SponsorshipRequestDonations_A_fkey" FOREIGN KEY ("A") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorshipRequestDonations" ADD CONSTRAINT "_SponsorshipRequestDonations_B_fkey" FOREIGN KEY ("B") REFERENCES "sponsorship_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
