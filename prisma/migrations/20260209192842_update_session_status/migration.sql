-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PROCESSING', 'READY', 'EXPIRED');

-- AlterTable
ALTER TABLE "upload_sessions" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'READY';
