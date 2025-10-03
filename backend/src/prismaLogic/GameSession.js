import prisma from "../services/prisma.js";

class GameSessionLogic {
  // Create a new game session
  static async createGameSession(roomPin, quizId = null, status = 'waiting') {
    try {
      return await prisma.gameSession.create({
        data: {
          roomPin,
          quizId,
          status,
        },
      });
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  // Get game session by room PIN
  static async getGameSessionByPin(roomPin) {
    try {
      return await prisma.gameSession.findUnique({
        where: { roomPin },
        include: { quiz: true }
      });
    } catch (error) {
      console.error('Error fetching game session by PIN:', error);
      throw error;
    }
  }

  // Update game session status
  static async updateStatus(roomPin, status) {
    try {
      return await prisma.gameSession.update({
        where: { roomPin },
        data: { status }
      });
    } catch (error) {
      console.error('Error updating game session status:', error);
      throw error;
    }
  }

  // End game session with results
  static async endGameSession(roomPin, results) {
    try {
      return await prisma.gameSession.update({
        where: { roomPin },
        data: {
          status: 'ended',
          endedAt: new Date(),
          results
        }
      });
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  }

  // Get all game sessions
  static async getAllGameSessions() {
    try {
      return await prisma.gameSession.findMany({
        orderBy: { createdAt: "desc" },
        include: { quiz: true }
      });
    } catch (error) {
      console.error('Error fetching game sessions:', error);
      throw error;
    }
  }

  // Delete game session
  static async deleteGameSession(roomPin) {
    try {
      return await prisma.gameSession.delete({
        where: { roomPin }
      });
    } catch (error) {
      console.error('Error deleting game session:', error);
      throw error;
    }
  }
}

export default GameSessionLogic;

