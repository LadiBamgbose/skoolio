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


