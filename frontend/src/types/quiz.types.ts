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
}


