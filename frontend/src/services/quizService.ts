import ApiHandler from '../utils/ApiHandler';
import type { QuizTypes } from '../types/quiz.types';
import { trackEvent } from './mixpanel';
import mixpanel from 'mixpanel-browser';

class QuizService {
  
  // Generate a quiz using AI
  static async generateQuiz(
    prompt: string, 
    gradeLevel: string, 
    questionCount: number,
    userId?: number
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
      
      // Track quiz creation in Mixpanel
      if (response.success) {
        trackEvent('Quiz Created', {
          gradeLevel,
          questionCount,
          promptLength: prompt.trim().length,
          isAuthenticated: !!userId,
        });

        // Increment user property for authenticated teachers
        if (userId) {
          mixpanel.people.increment('Quizzes Created');
        }
      }
      
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

  // Get quiz usage for current billing period (protected - requires auth)
  static async getQuizUsage(): Promise<QuizTypes.QuizUsageResponse> {
    try {
      const response: any = await ApiHandler.get('/quiz/usage');
      return response;
    } catch (error) {
      console.error('Error fetching quiz usage:', error);
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

  // Toggle quiz active status (protected - requires auth)
  static async toggleQuizStatus(quizId: number): Promise<QuizTypes.ToggleQuizStatusResponse> {
    try {
      const response: any = await ApiHandler.patch(`/quiz/${quizId}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error toggling quiz status:', error);
      throw error;
    }
  }

  // Delete quiz (protected - requires auth)
  static async deleteQuiz(quizId: number): Promise<QuizTypes.DeleteQuizResponse> {
    try {
      const response: any = await ApiHandler.delete(`/quiz/${quizId}`);
      return response;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }

  // Get quiz details with questions (protected - requires auth)
  static async getQuizDetails(quizId: number): Promise<QuizTypes.QuizDetailsResponse> {
    try {
      const response: any = await ApiHandler.get(`/quiz/${quizId}/details`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw error;
    }
  }

  // Get quiz responses (protected - requires auth)
  static async getQuizResponses(quizId: number): Promise<QuizTypes.QuizResponsesResponse> {
    try {
      const response: any = await ApiHandler.get(`/quiz/${quizId}/stats`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz responses:', error);
      throw error;
    }
  }
}

export default QuizService;
