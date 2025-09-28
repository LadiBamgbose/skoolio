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
  static async generateDemoQuiz(topic: string, options?: {
    questionCount?: number;
    difficulty?: string;
    educationLevel?: string;
  }): Promise<DemoQuizResponse> {
    try {
      const payload: any = {
        topic: topic.trim(),
        questionCount: options?.questionCount || 5,
        difficulty: options?.difficulty || 'Medium',
        educationLevel: options?.educationLevel || 'Middle/High school appropriate'
      };
      
      // Add admin key from env if it exists
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (adminKey) {
        payload.adminKey = adminKey;
      }
      
      const response: any = await ApiHandler.post('/demo-quiz', payload);
      return response;
    } catch (error) {
      console.error('Error generating demo quiz:', error);
      throw error;
    }
  }

  // Check demo quiz status (rate limiting)
  static async getDemoStatus(): Promise<DemoStatusResponse> {
    try {
      let url = '/demo-quiz/status';
      
      // Add admin key from env if it exists
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (adminKey) {
        url += `?adminKey=${adminKey}`;
      }
      
      const response: any = await ApiHandler.get(url);
      return response;
    } catch (error) {
      console.error('Error getting demo status:', error);
      throw error;
    }
  }
}

export default DemoQuizService;

