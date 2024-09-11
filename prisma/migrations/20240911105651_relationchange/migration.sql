-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_localGovernmentId_fkey";

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "localGovernmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_localGovernmentId_fkey" FOREIGN KEY ("localGovernmentId") REFERENCES "LocalGovernment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
