-- CreateTable
CREATE TABLE "public"."DemoQuiz" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemoQuiz_ipAddress_createdAt_idx" ON "public"."DemoQuiz"("ipAddress", "createdAt");
