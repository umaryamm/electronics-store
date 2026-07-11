
-- CreateTable
CREATE TABLE "ClientQuery" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unread',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientQuery_status_idx" ON "ClientQuery"("status");

-- CreateIndex
CREATE INDEX "ClientQuery_createdAt_idx" ON "ClientQuery"("createdAt");
