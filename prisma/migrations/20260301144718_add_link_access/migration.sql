-- CreateTable
CREATE TABLE "link_accesses" (
    "id" TEXT NOT NULL,
    "uploadSessionId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_accesses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "link_accesses" ADD CONSTRAINT "link_accesses_uploadSessionId_fkey" FOREIGN KEY ("uploadSessionId") REFERENCES "upload_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
