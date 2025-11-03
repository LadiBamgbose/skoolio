export namespace QuizTypes {
  export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }

  export interface QuestionWithoutAnswer {
    question: string;
    options: string[];
    type?: string;
  }

  export interface Quiz {
    id: number;
    topic: string;
    questions: Question[];
    shareLink: string;
    gradeLevel: string;
    createdAt: string;
  }

  export interface GenerateQuizResponse {
    success: boolean;
    quiz: Quiz;
  }

  export interface GetQuizResponse {
    success: boolean;
    quiz: {
      id: number;
      topic: string;
      questions: QuestionWithoutAnswer[];
      gradeLevel: string;
      totalQuestions: number;
    };
  }

  export interface SubmitQuizResponse {
    success: boolean;
    response: {
      id: number;
      score: number;
      totalQuestions: number;
      percentage: number;
      completedAt: string;
    };
  }

  export interface TeacherStats {
    totalQuizzes: number;
    activeQuizzes: number;
    inactiveQuizzes: number;
  }

  export interface TeacherStatsResponse {
    success: boolean;
    stats: TeacherStats;
  }

  export interface TeacherQuiz {
    id: number;
    shareLink: string;
    topic: string;
    gradeLevel: string;
    questionCount: number;
    totalResponses: number;
    averageScore: number | null;
    isActive: boolean;
    createdAt: string;
  }

  export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }

  export interface TeacherQuizzesResponse {
    success: boolean;
    quizzes: TeacherQuiz[];
    pagination: Pagination;
  }

  export interface ToggleQuizStatusResponse {
    success: boolean;
    message: string;
    quiz: {
      id: number;
      isActive: boolean;
      shareLink: string;
    };
  }

  export interface DeleteQuizResponse {
    success: boolean;
    message: string;
  }

  export interface QuizDetailsResponse {
    success: boolean;
    quiz: {
      id: number;
      topic: string;
      questions: Question[];
      gradeLevel: string;
      questionCount: number;
      isActive: boolean;
      createdAt: string;
    };
  }

  export interface QuizResponsesResponse {
    success: boolean;
    stats: {
      totalResponses: number;
      averageScore: number;
      highestScore: number;
      lowestScore: number;
      averageTimeSeconds: number;
      lastUpdated: string;
    };
    responses: Array<{
      studentName: string;
      score: number;
      totalQuestions: number;
      completedAt: string;
      timeTaken?: number;
      answers: any;
    }>;
  }

  export interface QuizUsageResponse {
    success: boolean;
    usage: {
      used: number;
      limit: number;
      remaining: number;
      canGenerate: boolean;
      plan: 'BASIC' | 'TEACHER' | 'ADVANCED';
      periodStart: string | null;
      periodEnd: string | null;
    };
  }
}


