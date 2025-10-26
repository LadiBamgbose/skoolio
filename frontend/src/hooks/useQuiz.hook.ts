import { useQuery } from '@tanstack/react-query';
import QuizService from '../services/quizService';
import type { QuizTypes } from '../types/quiz.types';

// Hook to fetch teacher's quiz statistics
export const useTeacherStats = () => {
  return useQuery<QuizTypes.TeacherStatsResponse, Error>({
    queryKey: ['teacherStats'],
    queryFn: () => QuizService.getTeacherStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

// Hook to fetch teacher's quizzes with pagination
export const useTeacherQuizzes = (page: number = 1, limit: number = 10) => {
  return useQuery<QuizTypes.TeacherQuizzesResponse, Error>({
    queryKey: ['teacherQuizzes', page, limit],
    queryFn: () => QuizService.getTeacherQuizzes(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};


