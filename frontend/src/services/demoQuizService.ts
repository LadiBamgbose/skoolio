import ApiHandler from '../utils/ApiHandler';

interface DemoQuizResponse {
  quiz: any;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface DemoStatusResponse {
  canCreateDemo: boolean;
  timeUntilNext?: number;
}

class DemoQuizService {
  
  // Generate a demo quiz
  static async generateDemoQuiz(topic: string): Promise<DemoQuizResponse> {
    try {
      const response: any = await ApiHandler.post('/demo-quiz', {
        topic: topic.trim()
      });
      return response;
    } catch (error) {
      console.error('Error generating demo quiz:', error);
      throw error;
    }
  }

  // Check demo quiz status (rate limiting)
  static async getDemoStatus(): Promise<DemoStatusResponse> {
    try {
      const response: any = await ApiHandler.get('/demo-quiz/status');
      return response;
    } catch (error) {
      console.error('Error getting demo status:', error);
      throw error;
    }
  }
}

export default DemoQuizService;

