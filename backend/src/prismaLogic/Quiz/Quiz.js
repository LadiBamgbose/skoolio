import prisma from "../../services/prisma.js";
import QuizUsageLogic from "./QuizUsage.js";

class QuizLogic {
  // Generate a unique 6-digit share code (like Kahoot)
  static generateShareLink() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create a new quiz
  // teacherId is optional - if provided, quiz is associated with teacher
  // if not provided, quiz is anonymous and tracked by IP
  static async createQuiz(prompt, questions, gradeLevel, questionCount, ipAddress, teacherId = null) {
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
          teacherId, // Can be null for anonymous quizzes
        },
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  // Count quizzes created by IP in current 30-day period (for anonymous users)
  static async countRecentQuizzesByIP(ipAddress) {
    try {
      // Use QuizUsage table for proper 30-day period tracking
      const period = await QuizUsageLogic.getOrCreateUsagePeriodByIP(ipAddress);
      return period.count;
    } catch (error) {
      console.error('Error counting recent quizzes:', error);
      throw error;
    }
  }

  // Count quizzes created by teacher in their current billing period
  // For PAID users: uses their Stripe billing cycle (currentPeriodEnd - 30 days to currentPeriodEnd)
  // For FREE users: uses QuizUsage table tracking (30-day periods starting from first quiz)
  static async countRecentQuizzesByTeacher(teacherId) {
    try {
      // Get user's subscription info
      const user = await prisma.user.findUnique({
        where: { id: teacherId },
        select: {
          plan: true,
          subscriptionStatus: true,
          currentPeriodEnd: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // For PAID users with active subscription, use billing cycle
      if (user.subscriptionStatus === 'ACTIVE' && user.currentPeriodEnd) {
        // Calculate billing period start (30 days before period end)
        const periodEnd = new Date(user.currentPeriodEnd);
        const periodStart = new Date(periodEnd);
        periodStart.setDate(periodStart.getDate() - 30);

        return await prisma.quiz.count({
          where: {
            teacherId,
            createdAt: {
              gte: periodStart,
              lte: periodEnd
            }
          }
        });
      }

      // For FREE users (BASIC plan without subscription) - use QuizUsage table
      const period = await QuizUsageLogic.getOrCreateUsagePeriod(teacherId);
      return period.count;

    } catch (error) {
      console.error('Error counting teacher recent quizzes:', error);
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
  static async deleteQuiz(quizId, teacherId) {
    try {
      // First, verify the quiz belongs to the teacher
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId }
      });

      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Verify ownership (only teacher can delete their own quiz)
      if (quiz.teacherId !== teacherId) {
        throw new Error('Unauthorized: You can only delete your own quizzes');
      }

      // Delete the quiz (cascade will delete responses and stats)
      return await prisma.quiz.delete({
        where: { id: quizId }
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

  // Get paginated list of teacher's quizzes with stats
  static async getQuizzesByTeacher(teacherId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await prisma.quiz.count({
        where: { teacherId }
      });

      // Get paginated quizzes with stats
      const quizzes = await prisma.quiz.findMany({
        where: { teacherId },
        include: {
          stats: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });

      return {
        quizzes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting teacher quizzes:', error);
      throw error;
    }
  }
}

export default QuizLogic;
