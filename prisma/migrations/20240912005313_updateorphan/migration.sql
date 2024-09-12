-- AlterTable
ALTER TABLE "Need" ADD COLUMN     "schoolName" TEXT;

-- AlterTable
ALTER TABLE "orphans" ADD COLUMN     "schoolName" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
