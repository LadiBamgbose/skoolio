import prisma from "../../services/prisma.js";

class QuizLogic {
  // Generate a unique 6-digit share code (like Kahoot)
  static generateShareLink() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create a new quiz
  static async createQuiz(prompt, questions, gradeLevel, questionCount, ipAddress) {
    try {
      let shareLink = this.generateShareLink();
      let attempts = 0;
      const maxAttempts = 10;

      // Ensure unique shareLink (handle collision)
      while (attempts < maxAttempts) {
        const existing = await prisma.quiz.findUnique({
          where: { shareLink }
        });

        if (!existing) break;
        
        shareLink = this.generateShareLink();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique share code');
      }
      
      return await prisma.quiz.create({
        data: {
          prompt,
          questions,
          shareLink,
          gradeLevel,
          questionCount,
          ipAddress,
        },
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  // Count quizzes created by IP in the last month (for rate limiting)
  static async countRecentQuizzesByIP(ipAddress) {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return await prisma.quiz.count({
        where: {
          ipAddress,
          createdAt: {
            gte: oneMonthAgo
          }
        }
      });
    } catch (error) {
      console.error('Error counting recent quizzes:', error);
      throw error;
    }
  }

  // Get quiz by share link (for students)
  static async getQuizByShareLink(shareLink) {
    try {
      return await prisma.quiz.findUnique({ 
        where: { shareLink },
        include: {
          stats: true
        }
      });
    } catch (error) {
      console.error('Error fetching quiz by share link:', error);
      throw error;
    }
  }

  // Get quiz by ID with responses and stats
  static async getQuizById(id) {
    try {
      return await prisma.quiz.findUnique({ 
        where: { id },
        include: {
          responses: {
            orderBy: { completedAt: 'desc' }
          },
          stats: true
        }
      });
    } catch (error) {
      console.error('Error fetching quiz by ID:', error);
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

  // Toggle quiz active status
  static async toggleQuizActive(quizId, teacherId) {
    try {
      // First, verify the quiz belongs to the teacher
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId }
      });

      if (!quiz) {
        throw new Error('Quiz not found');
      }

      if (quiz.teacherId !== teacherId) {
        throw new Error('Unauthorized: You do not own this quiz');
      }

      // Toggle the isActive status
      return await prisma.quiz.update({
        where: { id: quizId },
        data: { isActive: !quiz.isActive }
      });
    } catch (error) {
      console.error('Error toggling quiz active status:', error);
      throw error;
    }
  }

  // Get teacher quiz stats (total, active, inactive counts)
  static async getTeacherStats(teacherId) {
    try {
      const totalQuizzes = await prisma.quiz.count({
        where: { teacherId }
      });

      const activeQuizzes = await prisma.quiz.count({
        where: { 
          teacherId,
          isActive: true 
        }
      });

      const inactiveQuizzes = await prisma.quiz.count({
        where: { 
          teacherId,
          isActive: false 
        }
      });

      return {
        totalQuizzes,
        activeQuizzes,
        inactiveQuizzes
      };
    } catch (error) {
      console.error('Error getting teacher stats:', error);
      throw error;
    }
  }
}

export default QuizLogic;
