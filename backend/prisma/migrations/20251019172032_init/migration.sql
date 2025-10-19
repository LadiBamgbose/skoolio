-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('BASIC', 'TEACHER', 'ADVANCED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "plan" "public"."Plan" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "shareLink" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "teacherId" INTEGER,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuizResponse" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTaken" INTEGER,

    CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuizStats" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "lowestScore" INTEGER,
    "averageTimeSeconds" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuizUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "ipAddress" TEXT,
    "month" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuizUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_shareLink_key" ON "public"."Quiz"("shareLink");

-- CreateIndex
CREATE INDEX "Quiz_ipAddress_createdAt_idx" ON "public"."Quiz"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "Quiz_teacherId_createdAt_idx" ON "public"."Quiz"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "Quiz_shareLink_idx" ON "public"."Quiz"("shareLink");

-- CreateIndex
CREATE INDEX "QuizResponse_quizId_idx" ON "public"."QuizResponse"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizStats_quizId_key" ON "public"."QuizStats"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizUsage_userId_month_key" ON "public"."QuizUsage"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "QuizUsage_ipAddress_month_key" ON "public"."QuizUsage"("ipAddress", "month");

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResponse" ADD CONSTRAINT "QuizResponse_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizStats" ADD CONSTRAINT "QuizStats_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizUsage" ADD CONSTRAINT "QuizUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
