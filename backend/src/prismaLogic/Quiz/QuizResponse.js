import prisma from "../../services/prisma.js";

class QuizResponseLogic {
  // Submit a quiz response
  static async createResponse(quizId, studentName, answers, score, totalQuestions, timeTaken = null) {
    try {
      return await prisma.quizResponse.create({
        data: {
          quizId,
          studentName,
          answers,
          score,
          totalQuestions,
          timeTaken
        }
      });
    } catch (error) {
      console.error('Error creating quiz response:', error);
      throw error;
    }
  }

  // Get all responses for a quiz
  static async getResponsesByQuizId(quizId) {
    try {
      return await prisma.quizResponse.findMany({
        where: { quizId },
        orderBy: { completedAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching quiz responses:', error);
      throw error;
    }
  }

  // Get response by ID
  static async getResponseById(id) {
    try {
      return await prisma.quizResponse.findUnique({
        where: { id },
        include: {
          quiz: true
        }
      });
    } catch (error) {
      console.error('Error fetching quiz response:', error);
      throw error;
    }
  }
}

export default QuizResponseLogic;

