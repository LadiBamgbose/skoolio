import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class DemoQuizLogic {
  // Create a new demo quiz
  static async createDemoQuiz(topic, questions, ipAddress) {
    try {
      const demoQuiz = await prisma.demoQuiz.create({
        data: {
          topic,
          questions,
          ipAddress,
        },
      });
      return demoQuiz;
    } catch (error) {
      console.error('Error creating demo quiz:', error);
      throw error;
    }
  }

  // Check how many demo quizzes an IP has created in the last hour
  static async countRecentDemoQuizzesByIP(ipAddress) {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const count = await prisma.demoQuiz.count({
        where: {
          ipAddress,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });
      
      return count;
    } catch (error) {
      console.error('Error counting demo quizzes by IP:', error);
      throw error;
    }
  }

  // Get a demo quiz by ID
  static async getDemoQuizById(id) {
    try {
      const demoQuiz = await prisma.demoQuiz.findUnique({
        where: { id: parseInt(id) },
      });
      return demoQuiz;
    } catch (error) {
      console.error('Error getting demo quiz by ID:', error);
      throw error;
    }
  }

  // Clean up old demo quizzes (optional - for maintenance)
  static async cleanupOldDemoQuizzes(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await prisma.demoQuiz.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      console.log(`Cleaned up ${result.count} old demo quizzes`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old demo quizzes:', error);
      throw error;
    }
  }
}

export default DemoQuizLogic;
