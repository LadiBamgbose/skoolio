import prisma from "../../services/prisma.js";

class QuizStatsLogic {
  // Create or update stats after a response is submitted
  static async updateStats(quizId) {
    try {
      // Get all responses for this quiz
      const responses = await prisma.quizResponse.findMany({
        where: { quizId }
      });

      if (responses.length === 0) {
        return null;
      }

      // Calculate statistics
      const totalResponses = responses.length;
      const scores = responses.map(r => r.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / totalResponses;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      
      // Calculate average time (only for responses with timeTaken)
      const responsesWithTime = responses.filter(r => r.timeTaken !== null);
      const averageTimeSeconds = responsesWithTime.length > 0
        ? responsesWithTime.reduce((a, b) => a + b.timeTaken, 0) / responsesWithTime.length
        : null;

      // Upsert stats
      return await prisma.quizStats.upsert({
        where: { quizId },
        create: {
          quizId,
          totalResponses,
          averageScore,
          highestScore,
          lowestScore,
          averageTimeSeconds
        },
        update: {
          totalResponses,
          averageScore,
          highestScore,
          lowestScore,
          averageTimeSeconds
        }
      });
    } catch (error) {
      console.error('Error updating quiz stats:', error);
      throw error;
    }
  }

  // Get stats for a quiz
  static async getStatsByQuizId(quizId) {
    try {
      return await prisma.quizStats.findUnique({
        where: { quizId },
        include: {
          quiz: true
        }
      });
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw error;
    }
  }
}

export default QuizStatsLogic;

