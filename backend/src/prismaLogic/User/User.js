import prisma from "../../services/prisma.js";

class UserLogic {
  // Find user by ID
  static async findUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          state: true,
          plan: true,
          createdAt: true,
          updatedAt: true
          // Exclude password
        }
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          state: true,
          plan: true,
          createdAt: true,
          updatedAt: true
          // Exclude password
        }
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Update user plan
  static async updateUserPlan(userId, plan) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { plan }
      });
    } catch (error) {
      console.error('Error updating user plan:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, data) {
    try {
      const updateData = {};
      
      if (data.firstName) updateData.firstName = data.firstName.trim();
      if (data.lastName) updateData.lastName = data.lastName.trim();
      if (data.email) updateData.email = data.email.trim().toLowerCase();
      if (data.city !== undefined) updateData.city = data.city?.trim() || null;
      if (data.state !== undefined) updateData.state = data.state?.trim() || null;

      return await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          state: true,
          plan: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user's quizzes
  static async getUserQuizzes(userId) {
    try {
      return await prisma.quiz.findMany({
        where: { teacherId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          stats: true,
          _count: {
            select: { responses: true }
          }
        }
      });
    } catch (error) {
      console.error('Error getting user quizzes:', error);
      throw error;
    }
  }
}

export default UserLogic;

