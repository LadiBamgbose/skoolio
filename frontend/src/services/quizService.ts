import ApiHandler from '../utils/ApiHandler';
import type { QuizTypes } from '../types/quiz.types';

class QuizService {
  
  // Generate a quiz using AI
  static async generateQuiz(
    prompt: string, 
    gradeLevel: string, 
    questionCount: number
  ): Promise<QuizTypes.GenerateQuizResponse> {
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
  static async getQuizByShareLink(shareLink: string): Promise<QuizTypes.GetQuizResponse> {
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
  ): Promise<QuizTypes.SubmitQuizResponse> {
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

  // Get teacher's quiz statistics (protected - requires auth)
  static async getTeacherStats(): Promise<QuizTypes.TeacherStatsResponse> {
    try {
      const response: any = await ApiHandler.get('/quiz/teacher/stats');
      return response;
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
      throw error;
    }
  }

  // Get teacher's quizzes with pagination (protected - requires auth)
  static async getTeacherQuizzes(
    page: number = 1,
    limit: number = 10
  ): Promise<QuizTypes.TeacherQuizzesResponse> {
    try {
      const response: any = await ApiHandler.get(`/quiz/teacher/quizzes?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching teacher quizzes:', error);
      throw error;
    }
  }
}

export default QuizService;
