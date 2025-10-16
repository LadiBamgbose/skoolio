import ApiHandler from '../utils/ApiHandler';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface GenerateQuizResponse {
  success: boolean;
  quiz: {
    id: number;
    topic: string;
    questions: Question[];
    shareLink: string;
    gradeLevel: string;
    createdAt: string;
  };
}

class QuizService {
  
  // Generate a quiz using AI
  static async generateQuiz(
    prompt: string, 
    gradeLevel: string, 
    questionCount: number
  ): Promise<GenerateQuizResponse> {
    try {
      const payload = {
        prompt: prompt.trim(),
        gradeLevel,
        questionCount
      };
      
      const response: any = await ApiHandler.post('/quiz/generate', payload);
      return response;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }
}

export default QuizService;

