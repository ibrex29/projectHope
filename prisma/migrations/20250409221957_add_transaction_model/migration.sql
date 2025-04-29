-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('notPaid', 'paid', 'pending', 'failed');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionReference" TEXT,
    "paymentLink" TEXT,
    "transactionStatus" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'notPaid',
    "sponsorshipRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionReference_key" ON "Transaction"("transactionReference");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sponsorshipRequestId_fkey" FOREIGN KEY ("sponsorshipRequestId") REFERENCES "sponsorship_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
