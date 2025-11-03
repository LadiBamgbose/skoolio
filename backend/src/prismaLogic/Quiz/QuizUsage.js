import prisma from "../../services/prisma.js";

class QuizUsageLogic {
  /**
   * Get or create usage period for a user
   * For FREE users: tracks 30-day periods starting from first quiz
   * @param {number} userId - User ID
   * @returns {Object} - { count, periodStart, periodEnd, isExpired }
   */
  static async getOrCreateUsagePeriod(userId) {
    try {
      // Find existing usage record
      let usageRecord = await prisma.quizUsage.findFirst({
        where: { userId },
        orderBy: { id: 'desc' } // Get most recent
      });

      const now = new Date();

      // If no record exists, create one
      if (!usageRecord) {
        const periodStart = now.toISOString().split('T')[0]; // "2025-01-15"
        
        usageRecord = await prisma.quizUsage.create({
          data: {
            userId,
            month: periodStart, // Store period start date
            count: 0
          }
        });

        return {
          count: 0,
          periodStart: new Date(periodStart),
          periodEnd: this.calculatePeriodEnd(new Date(periodStart)),
          isExpired: false
        };
      }

      // Check if period expired (> 30 days old)
      const periodStart = new Date(usageRecord.month);
      const periodEnd = this.calculatePeriodEnd(periodStart);
      const isExpired = now > periodEnd;

      if (isExpired) {
        // Reset the record with new period
        const newPeriodStart = now.toISOString().split('T')[0];
        
        usageRecord = await prisma.quizUsage.update({
          where: { id: usageRecord.id },
          data: {
            month: newPeriodStart,
            count: 0
          }
        });

        return {
          count: 0,
          periodStart: new Date(newPeriodStart),
          periodEnd: this.calculatePeriodEnd(new Date(newPeriodStart)),
          isExpired: false
        };
      }

      return {
        count: usageRecord.count,
        periodStart,
        periodEnd,
        isExpired: false
      };

    } catch (error) {
      console.error('Error getting/creating usage period:', error);
      throw error;
    }
  }

  /**
   * Get or create usage period for anonymous user (by IP)
   * @param {string} ipAddress - IP address
   * @returns {Object} - { count, periodStart, periodEnd, isExpired }
   */
  static async getOrCreateUsagePeriodByIP(ipAddress) {
    try {
      // Find existing usage record
      let usageRecord = await prisma.quizUsage.findFirst({
        where: { ipAddress },
        orderBy: { id: 'desc' }
      });

      const now = new Date();

      // If no record exists, create one
      if (!usageRecord) {
        const periodStart = now.toISOString().split('T')[0];
        
        usageRecord = await prisma.quizUsage.create({
          data: {
            ipAddress,
            month: periodStart,
            count: 0
          }
        });

        return {
          count: 0,
          periodStart: new Date(periodStart),
          periodEnd: this.calculatePeriodEnd(new Date(periodStart)),
          isExpired: false
        };
      }

      // Check if period expired
      const periodStart = new Date(usageRecord.month);
      const periodEnd = this.calculatePeriodEnd(periodStart);
      const isExpired = now > periodEnd;

      if (isExpired) {
        const newPeriodStart = now.toISOString().split('T')[0];
        
        usageRecord = await prisma.quizUsage.update({
          where: { id: usageRecord.id },
          data: {
            month: newPeriodStart,
            count: 0
          }
        });

        return {
          count: 0,
          periodStart: new Date(newPeriodStart),
          periodEnd: this.calculatePeriodEnd(new Date(newPeriodStart)),
          isExpired: false
        };
      }

      return {
        count: usageRecord.count,
        periodStart,
        periodEnd,
        isExpired: false
      };

    } catch (error) {
      console.error('Error getting/creating usage period by IP:', error);
      throw error;
    }
  }

  /**
   * Increment usage count for a user
   * @param {number} userId - User ID
   * @returns {Object} - Updated usage record
   */
  static async incrementUsage(userId) {
    try {
      // Get or create current period
      const period = await this.getOrCreateUsagePeriod(userId);

      // Find the record and increment
      const usageRecord = await prisma.quizUsage.findFirst({
        where: { 
          userId,
          month: period.periodStart.toISOString().split('T')[0]
        }
      });

      if (!usageRecord) {
        throw new Error('Usage record not found');
      }

      return await prisma.quizUsage.update({
        where: { id: usageRecord.id },
        data: {
          count: {
            increment: 1
          }
        }
      });

    } catch (error) {
      console.error('Error incrementing usage:', error);
      throw error;
    }
  }

  /**
   * Increment usage count for anonymous user (by IP)
   * @param {string} ipAddress - IP address
   * @returns {Object} - Updated usage record
   */
  static async incrementUsageByIP(ipAddress) {
    try {
      const period = await this.getOrCreateUsagePeriodByIP(ipAddress);

      const usageRecord = await prisma.quizUsage.findFirst({
        where: { 
          ipAddress,
          month: period.periodStart.toISOString().split('T')[0]
        }
      });

      if (!usageRecord) {
        throw new Error('Usage record not found');
      }

      return await prisma.quizUsage.update({
        where: { id: usageRecord.id },
        data: {
          count: {
            increment: 1
          }
        }
      });

    } catch (error) {
      console.error('Error incrementing usage by IP:', error);
      throw error;
    }
  }

  /**
   * Calculate period end date (30 days after start)
   * @param {Date} periodStart - Period start date
   * @returns {Date} - Period end date
   */
  static calculatePeriodEnd(periodStart) {
    const endDate = new Date(periodStart);
    endDate.setDate(endDate.getDate() + 30);
    return endDate;
  }

  /**
   * Check usage limit for a user
   * @param {number} userId - User ID
   * @param {number} limit - Limit (default 5 for FREE)
   * @returns {Object} - { used, limit, remaining, canGenerate, periodStart, periodEnd }
   */
  static async checkLimit(userId, limit = 5) {
    try {
      const period = await this.getOrCreateUsagePeriod(userId);

      return {
        used: period.count,
        limit,
        remaining: Math.max(0, limit - period.count),
        canGenerate: period.count < limit,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd
      };

    } catch (error) {
      console.error('Error checking limit:', error);
      throw error;
    }
  }

  /**
   * Check usage limit for anonymous user (by IP)
   * @param {string} ipAddress - IP address
   * @param {number} limit - Limit (default 3 for anonymous)
   * @returns {Object} - { used, limit, remaining, canGenerate, periodStart, periodEnd }
   */
  static async checkLimitByIP(ipAddress, limit = 3) {
    try {
      const period = await this.getOrCreateUsagePeriodByIP(ipAddress);

      return {
        used: period.count,
        limit,
        remaining: Math.max(0, limit - period.count),
        canGenerate: period.count < limit,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd
      };

    } catch (error) {
      console.error('Error checking limit by IP:', error);
      throw error;
    }
  }
}

export default QuizUsageLogic;

