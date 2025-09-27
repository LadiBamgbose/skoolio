import prisma from "../services/prisma.js";

// create a new quiz
export async function createQuiz(prompt, questions) {
  return prisma.quiz.create({
    data: {
      prompt,
      questions,
    },
  });
}

// get all quizzes (for testing)
export async function getAllQuizzes() {
  return prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
  });
}
