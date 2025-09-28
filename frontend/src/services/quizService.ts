import ApiHandler from '../utils/ApiHandler';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  title: string;
  topic: string;
  questions: Question[];
  timeLimit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Quiz extends QuizData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface QuizResponse {
  quiz: Quiz;
  success: boolean;
  message?: string;
}

class QuizService {
  
  // Create a new quiz (for authenticated users)
  static async createQuiz(quizData: QuizData): Promise<QuizResponse> {
    try {
      const response: any = await ApiHandler.post('/quiz', quizData);
      return response;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  // Get quiz by ID
  static async getQuizById(quizId: string): Promise<Quiz> {
    try {
      const response: any = await ApiHandler.get(`/quiz/${quizId}`);
      return response;
    } catch (error) {
      console.error('Error getting quiz:', error);
      throw error;
    }
  }

  // Get all quizzes for user
  static async getUserQuizzes(): Promise<Quiz[]> {
    try {
      const response: any = await ApiHandler.get('/quiz');
      return response;
    } catch (error) {
      console.error('Error getting user quizzes:', error);
      throw error;
    }
  }

  // Update quiz
  static async updateQuiz(quizId: string, quizData: Partial<QuizData>): Promise<QuizResponse> {
    try {
      const response: any = await ApiHandler.put(`/quiz/${quizId}`, quizData);
      return response;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  }

  // Delete quiz
  static async deleteQuiz(quizId: string): Promise<{ success: boolean }> {
    try {
      const response: any = await ApiHandler.delete(`/quiz/${quizId}`);
      return response;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
}

export default QuizService;

