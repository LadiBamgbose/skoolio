import ApiHandler from '../utils/ApiHandler';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResponse {
  success: boolean;
  quiz: {
    topic: string;
    questions: Question[];
    generatedAt: string;
  };
}

interface QuizStatusResponse {
  canCreateDemo: boolean;
  demosUsedInLastHour: number;
  limit: number;
}

class QuizService {
  
  // Generate a quiz using AI
  static async generateQuiz(topic: string, options?: {
    questionCount?: number;
    difficulty?: string;
    educationLevel?: string;
  }): Promise<QuizResponse> {
    try {
      const payload: any = {
        topic: topic.trim(),
        questionCount: options?.questionCount || 5,
        difficulty: options?.difficulty || 'Medium',
        educationLevel: options?.educationLevel || 'Middle/High school appropriate'
      };
      
      const response: any = await ApiHandler.post('/quiz', payload);
      return response;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  // Check quiz generation status (rate limiting)
  static async getQuizStatus(): Promise<QuizStatusResponse> {
    try {
      const response: any = await ApiHandler.get('/quiz/status');
      return response;
    } catch (error) {
      console.error('Error getting quiz status:', error);
      throw error;
    }
  }
}

export default QuizService;

