import express from 'express';
import OpenAIService from '../services/OpenAIService.js';
import DemoQuizLogic from '../prismaLogic/DemoQuiz.js';

const router = express.Router();

// Helper function to get client IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// POST /api/demo-quiz - Generate a demo quiz
router.post('/', async (req, res) => {
  try {
    const { topic } = req.body;

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Topic is required and must be a non-empty string'
      });
    }

    if (topic.trim().length > 100) {
      return res.status(400).json({
        error: 'Topic must be less than 100 characters'
      });
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Check rate limit: 1 demo quiz per IP per hour
    const recentDemoCount = await DemoQuizLogic.countRecentDemoQuizzesByIP(clientIP);
    
    if (recentDemoCount >= 1) {
      return res.status(429).json({
        error: 'Demo limit reached. You can try one demo quiz per hour. Sign up for unlimited access!',
        rateLimitReached: true
      });
    }

    // Generate quiz using OpenAI
    console.log(`Generating demo quiz for topic: "${topic.trim()}" from IP: ${clientIP}`);
    const quizData = await OpenAIService.generateQuizQuestions(topic.trim());

    // Save demo quiz to database
    const savedDemoQuiz = await DemoQuizLogic.createDemoQuiz(
      topic.trim(),
      quizData,
      clientIP
    );

    // Return quiz data (without exposing database ID or IP)
    res.status(200).json({
      success: true,
      quiz: {
        topic: quizData.topic,
        questions: quizData.questions,
        generatedAt: savedDemoQuiz.createdAt
      }
    });

  } catch (error) {
    console.error('Demo quiz generation error:', error);

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
      error: 'Failed to generate demo quiz. Please try again.'
    });
  }
});

// GET /api/demo-quiz/status - Check if IP can create demo quiz
router.get('/status', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const recentDemoCount = await DemoQuizLogic.countRecentDemoQuizzesByIP(clientIP);
    
    res.status(200).json({
      canCreateDemo: recentDemoCount < 1,
      demosUsedInLastHour: recentDemoCount,
      limit: 1
    });
  } catch (error) {
    console.error('Error checking demo status:', error);
    res.status(500).json({
      error: 'Failed to check demo status'
    });
  }
});

export default router;
