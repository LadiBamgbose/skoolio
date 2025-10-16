import express from 'express';
import OpenAIService from '../services/OpenAIService.js';
import QuizLogic from '../prismaLogic/Quiz/Quiz.js';
import QuizResponseLogic from '../prismaLogic/Quiz/QuizResponse.js';
import QuizStatsLogic from '../prismaLogic/Quiz/QuizStats.js';

const router = express.Router();

// Helper function to get client IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// POST /api/quiz/generate - Generate a quiz
router.post('/generate', async (req, res) => {
  try {
    const { prompt, gradeLevel, questionCount, adminKey } = req.body;

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

    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Check rate limit: 3 quizzes per month per IP (skip if admin key provided)
    if (!adminKey || adminKey !== 'skoolio_dev_2024') {
      const recentQuizCount = await QuizLogic.countRecentQuizzesByIP(clientIP);
      
      if (recentQuizCount >= 3) {
        return res.status(429).json({
          error: 'Free plan limit reached. You can create 3 quizzes per month. Upgrade to Teacher plan for unlimited quizzes!',
          rateLimitReached: true
        });
      }
    }

    // Prepare options for OpenAI
    const options = {
      questionCount,
      gradeLevel
    };

    // Generate quiz using OpenAI
    console.log(`Generating quiz for prompt: "${prompt.trim()}" from IP: ${clientIP}`);
    console.log('Quiz options:', options);
    const quizData = await OpenAIService.generateQuizQuestions(prompt.trim(), options);

    // Save quiz to database (shareLink is generated inside createQuiz)
    const savedQuiz = await QuizLogic.createQuiz(
      prompt.trim(),
      quizData,
      gradeLevel,
      questionCount,
      clientIP
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

// GET /api/quiz/:shareLink - Get quiz by share link (for students)
router.get('/:shareLink', async (req, res) => {
  try {
    const { shareLink } = req.params;

    const quiz = await QuizLogic.getQuizByShareLink(shareLink);

    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Return quiz without answers for students
    const quizData = JSON.parse(quiz.questions);
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
    const quizData = JSON.parse(quiz.questions);
    let score = 0;
    const totalQuestions = quizData.questions.length;

    quizData.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
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

export default router;
