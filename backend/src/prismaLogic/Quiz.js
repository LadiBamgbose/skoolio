import prisma from "../services/prisma.js";

class QuizLogic {
  // Create a new quiz
  static async createQuiz(prompt, questions) {
    try {
      return await prisma.quiz.create({
        data: {
          prompt,
          questions,
        },
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  // Get all quizzes
  static async getAllQuizzes() {
    try {
      return await prisma.quiz.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  // Get quiz by ID
  static async getQuizById(id) {
    try {
      return await prisma.quiz.findUnique({ 
        where: { id } 
      });
    } catch (error) {
      console.error('Error fetching quiz by ID:', error);
      throw error;
    }
  }

  // Update quiz
  static async updateQuiz(id, data) {
    try {
      return await prisma.quiz.update({
        where: { id },
        data
      });
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  }

  // Delete quiz
  static async deleteQuiz(id) {
    try {
      return await prisma.quiz.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
}

export default QuizLogic;
