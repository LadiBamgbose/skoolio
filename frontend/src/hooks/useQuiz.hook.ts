import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Hook to toggle quiz status
export const useToggleQuizStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<QuizTypes.ToggleQuizStatusResponse, Error, number>({
    mutationFn: (quizId: number) => QuizService.toggleQuizStatus(quizId),
    onSuccess: () => {
      // Invalidate and refetch teacher quizzes and stats
      queryClient.invalidateQueries({ queryKey: ['teacherQuizzes'] });
      queryClient.invalidateQueries({ queryKey: ['teacherStats'] });
    },
  });
};

// Hook to delete quiz with optimistic updates
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QuizTypes.DeleteQuizResponse, 
    Error, 
    number,
    { previousQuizzes: Array<[unknown, unknown]> }
  >({
    mutationFn: (quizId: number) => QuizService.deleteQuiz(quizId),
    
    // OPTIMISTIC UPDATE: Remove quiz from UI immediately
    onMutate: async (quizId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['teacherQuizzes'] });

      // Snapshot the previous value
      const previousQuizzes = queryClient.getQueriesData({ queryKey: ['teacherQuizzes'] });

      // Optimistically update all quiz list caches
      queryClient.setQueriesData(
        { queryKey: ['teacherQuizzes'] },
        (old: QuizTypes.TeacherQuizzesResponse | undefined) => {
          if (!old) return old;
          
          return {
            ...old,
            quizzes: old.quizzes.filter(quiz => quiz.id !== quizId),
            pagination: {
              ...old.pagination,
              total: old.pagination.total - 1
            }
          };
        }
      );

      // Return context with the snapshot
      return { previousQuizzes };
    },

    // If mutation fails, roll back to previous state
    onError: (err, _quizId, context) => {
      console.error('Failed to delete quiz:', err);
      
      // Restore the previous data
      if (context?.previousQuizzes) {
        context.previousQuizzes.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherQuizzes'] });
      queryClient.invalidateQueries({ queryKey: ['teacherStats'] });
    },
  });
};

// Hook to fetch quiz details with questions
export const useQuizDetails = (quizId: number | null) => {
  return useQuery<QuizTypes.QuizDetailsResponse, Error>({
    queryKey: ['quizDetails', quizId],
    queryFn: () => QuizService.getQuizDetails(quizId!),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch quiz responses
export const useQuizResponses = (quizId: number | null) => {
  return useQuery<QuizTypes.QuizResponsesResponse, Error>({
    queryKey: ['quizResponses', quizId],
    queryFn: () => QuizService.getQuizResponses(quizId!),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};


