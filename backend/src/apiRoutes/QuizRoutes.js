import express from 'express';
import OpenAIService from '../services/OpenAIService.js';
import QuizLogic from '../prismaLogic/Quiz/Quiz.js';
import QuizResponseLogic from '../prismaLogic/Quiz/QuizResponse.js';
import QuizStatsLogic from '../prismaLogic/Quiz/QuizStats.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Helper function to get client IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// ============================================
// SPECIFIC LITERAL ROUTES (MOST SPECIFIC FIRST)
// ============================================

// POST /api/quiz/generate - Generate a quiz (optionally authenticated)
router.post('/generate', optionalAuthMiddleware, async (req, res) => {
  try {
    const { prompt, gradeLevel, questionCount, adminKey } = req.body;
    const isAuthenticated = !!req.user;
    const teacherId = isAuthenticated ? req.user.userId : null;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required and must be a non-empty string'
      });
    }

    if (prompt.trim().length > 500) {
      return res.status(400).json({
        error: 'Prompt must be less than 500 characters'
      });
    }

    if (!gradeLevel || !questionCount) {
      return res.status(400).json({
        error: 'Grade level and question count are required'
      });
    }

    // Get client IP
    const clientIP = getClientIP(req);
    
    // Rate limiting logic
    if (!adminKey || adminKey !== 'skoolio_dev_2024') {
      if (isAuthenticated) {
        // For authenticated users: check by teacherId and plan
        const recentQuizCount = await QuizLogic.countRecentQuizzesByTeacher(teacherId);
        const userPlan = req.user.plan;
        
        // Plan limits: BASIC = 5, TEACHER = 60, ADVANCED = unlimited
        let limit = 5;
        if (userPlan === 'TEACHER') limit = 60;
        if (userPlan === 'ADVANCED') limit = Infinity;
        
        if (recentQuizCount >= limit) {
          return res.status(429).json({
            error: `${userPlan} plan limit reached. You can create ${limit} quizzes per month.`,
            rateLimitReached: true,
            currentPlan: userPlan,
            limit,
            used: recentQuizCount
          });
        }
        
        console.log(`Authenticated - Teacher ID: ${teacherId}, Plan: ${userPlan}, Used: ${recentQuizCount}/${limit}`);
      } else {
        // For anonymous users: check by IP (3 per month)
        const recentQuizCount = await QuizLogic.countRecentQuizzesByIP(clientIP);
        
        if (recentQuizCount >= 3) {
          return res.status(429).json({
            error: 'Free plan limit reached. You can create 3 quizzes per month. Sign up for more!',
            rateLimitReached: true,
            limit: 3,
            used: recentQuizCount
          });
        }
        
        console.log(`Anonymous - IP: ${clientIP}, Used: ${recentQuizCount}/3`);
      }
    }

    // Prepare options for OpenAI
    const options = {
      questionCount,
      gradeLevel
    };

    // Generate quiz using OpenAI
    console.log(`Generating quiz for prompt: "${prompt.trim()}"`);
    const quizData = await OpenAIService.generateQuizQuestions(prompt.trim(), options);

    // Save quiz to database (with optional teacherId)
    const savedQuiz = await QuizLogic.createQuiz(
      prompt.trim(),
      quizData,
      gradeLevel,
      questionCount,
      clientIP,
      teacherId
    );

    // Return quiz data with share link
    res.status(200).json({
      success: true,
      quiz: {
        id: savedQuiz.id,
        topic: quizData.topic,
        questions: quizData.questions,
        shareLink: savedQuiz.shareLink,
        gradeLevel: savedQuiz.gradeLevel,
        createdAt: savedQuiz.createdAt
      }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);

    // Handle specific error types
    if (error.message.includes('OpenAI API')) {
      return res.status(503).json({
        error: 'Quiz generation service temporarily unavailable. Please try again later.'
      });
    }

    if (error.message.includes('quota exceeded')) {
      return res.status(503).json({
        error: 'Service temporarily unavailable due to high demand. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to generate quiz. Please try again.'
    });
  }
});

// GET /api/quiz/status - Check if IP can create quiz
router.get('/status', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const adminKey = req.query.adminKey;
    
    // Skip rate limit check if admin key provided
    if (adminKey && adminKey === 'skoolio_dev_2024') {
      return res.status(200).json({
        canCreateQuiz: true,
        quizzesUsedThisMonth: 0,
        limit: 3
      });
    }
    
    const recentQuizCount = await QuizLogic.countRecentQuizzesByIP(clientIP);
    
    res.status(200).json({
      canCreateQuiz: recentQuizCount < 3,
      quizzesUsedThisMonth: recentQuizCount,
      limit: 3
    });
  } catch (error) {
    console.error('Error checking quiz status:', error);
    res.status(500).json({
      error: 'Failed to check quiz status'
    });
  }
});

// GET /api/quiz/teacher/stats - Get teacher's quiz statistics (protected)
router.get('/teacher/stats', authMiddleware, async (req, res) => {
  try {
    const teacherId = req.user.userId; // From auth middleware

    const stats = await QuizLogic.getTeacherStats(teacherId);

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({
      error: 'Failed to fetch teacher statistics'
    });
  }
});

// GET /api/quiz/teacher/quizzes - Get teacher's quizzes with pagination (protected)
router.get('/teacher/quizzes', authMiddleware, async (req, res) => {
  try {
    const teacherId = req.user.userId; // From auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid pagination parameters'
      });
    }

    const result = await QuizLogic.getQuizzesByTeacher(teacherId, page, limit);

    // Format response: extract topic from questions JSON
    const formattedQuizzes = result.quizzes.map(quiz => {
      const questionsData = quiz.questions;
      const topic = questionsData.topic || 'Untitled Quiz';

      return {
        id: quiz.id,
        shareLink: quiz.shareLink,
        topic,
        gradeLevel: quiz.gradeLevel,
        questionCount: quiz.questionCount,
        totalResponses: quiz.stats?.totalResponses || 0,
        averageScore: quiz.stats?.averageScore || null,
        isActive: quiz.isActive,
        createdAt: quiz.createdAt
      };
    });

    res.status(200).json({
      success: true,
      quizzes: formattedQuizzes,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error fetching teacher quizzes:', error);
    res.status(500).json({
      error: 'Failed to fetch quizzes'
    });
  }
});

// ============================================
// PARAMETERIZED ROUTES WITH SPECIFIC SUFFIXES
// ============================================

// GET /api/quiz/:quizId/stats - Get quiz statistics (for teachers)
router.get('/:quizId/stats', async (req, res) => {
  try {
    const { quizId } = req.params;

    const stats = await QuizStatsLogic.getStatsByQuizId(parseInt(quizId));

    if (!stats) {
      return res.status(404).json({
        error: 'Quiz stats not found'
      });
    }

    // Get all responses for detailed view
    const responses = await QuizResponseLogic.getResponsesByQuizId(parseInt(quizId));

    res.status(200).json({
      success: true,
      stats: {
        totalResponses: stats.totalResponses,
        averageScore: stats.averageScore,
        highestScore: stats.highestScore,
        lowestScore: stats.lowestScore,
        averageTimeSeconds: stats.averageTimeSeconds,
        lastUpdated: stats.lastUpdated
      },
      responses: responses.map(r => ({
        studentName: r.studentName,
        score: r.score,
        totalQuestions: r.totalQuestions,
        percentage: Math.round((r.score / r.totalQuestions) * 100),
        completedAt: r.completedAt,
        timeTaken: r.timeTaken
      }))
    });

  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({
      error: 'Failed to fetch quiz stats'
    });
  }
});

// POST /api/quiz/:quizId/submit - Submit quiz response (for students)
router.post('/:quizId/submit', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentName, answers, timeTaken } = req.body;

    // Validate input
    if (!studentName || typeof studentName !== 'string' || studentName.trim().length === 0) {
      return res.status(400).json({
        error: 'Student name is required'
      });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Answers are required'
      });
    }

    // Get quiz with correct answers
    const quiz = await QuizLogic.getQuizById(parseInt(quizId));

    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Calculate score
    const quizData = quiz.questions;
    let score = 0;
    const totalQuestions = quizData.questions.length;

    quizData.questions.forEach((q, index) => {
      const studentAnswer = answers[index.toString()];
      const correctAnswerLetter = q.correctAnswer;
      
      // Extract the letter from student answer (e.g., "B) Cotton" -> "B")
      const studentAnswerLetter = studentAnswer ? studentAnswer.split(')')[0] : null;
      
      if (studentAnswerLetter === correctAnswerLetter) {
        score++;
      }
    });

    // Save response
    const response = await QuizResponseLogic.createResponse(
      parseInt(quizId),
      studentName.trim(),
      answers,
      score,
      totalQuestions,
      timeTaken
    );

    // Update stats
    await QuizStatsLogic.updateStats(parseInt(quizId));

    res.status(200).json({
      success: true,
      response: {
        id: response.id,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        completedAt: response.completedAt
      }
    });

  } catch (error) {
    console.error('Error submitting quiz response:', error);
    res.status(500).json({
      error: 'Failed to submit quiz response'
    });
  }
});

// PATCH /api/quiz/:quizId/toggle-active - Toggle quiz active status (for teachers)
router.patch('/:quizId/toggle-active', authMiddleware, async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.userId; // From auth middleware

    const updatedQuiz = await QuizLogic.toggleQuizActive(parseInt(quizId), teacherId);

    res.status(200).json({
      success: true,
      message: `Quiz ${updatedQuiz.isActive ? 'activated' : 'deactivated'} successfully`,
      quiz: {
        id: updatedQuiz.id,
        isActive: updatedQuiz.isActive,
        shareLink: updatedQuiz.shareLink
      }
    });

  } catch (error) {
    console.error('Error toggling quiz active status:', error);

    if (error.message === 'Quiz not found') {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to toggle quiz status'
    });
  }
});

// ============================================
// MOST GENERIC ROUTES (LAST - CATCH-ALL)
// ============================================

// GET /api/quiz/:shareLink - Get quiz by share link (for students)
// MUST BE LAST among GET routes as it's most generic
router.get('/:shareLink', async (req, res) => {
  try {
    const { shareLink } = req.params;

    const quiz = await QuizLogic.getQuizByShareLink(shareLink);

    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Check if quiz is active
    if (!quiz.isActive) {
      return res.status(403).json({
        error: 'This quiz is closed',
        isActive: false
      });
    }

    // Return quiz without answers for students
    const quizData = quiz.questions;
    const questionsWithoutAnswers = quizData.questions.map(q => ({
      question: q.question,
      options: q.options,
      type: q.type
    }));

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz.id,
        topic: quizData.topic,
        questions: questionsWithoutAnswers,
        gradeLevel: quiz.gradeLevel,
        totalQuestions: quiz.questionCount
      }
    });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      error: 'Failed to fetch quiz'
    });
  }
});

export default router;
