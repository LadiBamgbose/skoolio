-- CreateTable
CREATE TABLE "public"."GameSession" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER,
    "roomPin" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "results" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_roomPin_key" ON "public"."GameSession"("roomPin");

-- CreateIndex
CREATE INDEX "GameSession_roomPin_idx" ON "public"."GameSession"("roomPin");

-- CreateIndex
CREATE INDEX "GameSession_status_idx" ON "public"."GameSession"("status");

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
