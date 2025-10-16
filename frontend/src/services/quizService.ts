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

interface GetQuizResponse {
  success: boolean;
  quiz: {
    id: number;
    topic: string;
    questions: {
      question: string;
      options: string[];
      type?: string;
    }[];
    gradeLevel: string;
    totalQuestions: number;
  };
}

interface SubmitQuizResponse {
  success: boolean;
  response: {
    id: number;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
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
      const payload: any = {
        prompt: prompt.trim(),
        gradeLevel,
        questionCount
      };
      
      // Only add admin key if set in env (for development)
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (adminKey) {
        payload.adminKey = adminKey;
      }
      
      const response: any = await ApiHandler.post('/quiz/generate', payload);
      return response;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  // Get quiz by share link (for students)
  static async getQuizByShareLink(shareLink: string): Promise<GetQuizResponse> {
    try {
      const response: any = await ApiHandler.get(`/quiz/${shareLink}`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  // Submit quiz answers (for students)
  static async submitQuiz(
    quizId: number,
    studentName: string,
    answers: { [key: number]: string },
    timeTaken?: number
  ): Promise<SubmitQuizResponse> {
    try {
      const payload = {
        studentName,
        answers,
        timeTaken
      };
      
      const response: any = await ApiHandler.post(`/quiz/${quizId}/submit`, payload);
      return response;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }
}

export default QuizService;

