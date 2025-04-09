-- CreateTable
CREATE TABLE "EditRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "current" JSONB NOT NULL,
    "edit" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "sponsorshipRequestId" TEXT,
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,

    CONSTRAINT "EditRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_sponsorshipRequestId_fkey" FOREIGN KEY ("sponsorshipRequestId") REFERENCES "sponsorship_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
