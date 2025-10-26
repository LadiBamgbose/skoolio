import { createContext, useContext, useState, type ReactNode } from 'react'
import QuizService from '../services/quizService'

interface Question {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface Quiz {
  questions: Question[]
  shareLink: string
}

type QuizStatus = 'idle' | 'loading' | 'success' | 'error'

interface QuizCreationContextType {
  status: QuizStatus
  quiz: Quiz | null
  error: string | null
  generateQuiz: (topic: string, gradeLevel: string, questionCount: number) => Promise<void>
  resetQuiz: () => void
}

const QuizCreationContext = createContext<QuizCreationContextType | undefined>(undefined)

export function QuizCreationProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<QuizStatus>('idle')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateQuiz = async (topic: string, gradeLevel: string, questionCount: number) => {
    setStatus('loading')
    setError(null)
    
    try {
      const response = await QuizService.generateQuiz(topic, gradeLevel, questionCount)
      setQuiz(response.quiz)
      setStatus('success')
    } catch (err: any) {
      console.error('Quiz generation failed:', err)
      
      // Handle specific error cases
      let errorMessage = 'Failed to generate quiz. Please try again.'
      
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setStatus('error')
    }
  }

  const resetQuiz = () => {
    setStatus('idle')
    setQuiz(null)
    setError(null)
  }

  return (
    <QuizCreationContext.Provider
      value={{
        status,
        quiz,
        error,
        generateQuiz,
        resetQuiz
      }}
    >
      {children}
    </QuizCreationContext.Provider>
  )
}

// Custom hook to use quiz creation context
export function useQuizCreation() {
  const context = useContext(QuizCreationContext)
  if (context === undefined) {
    throw new Error('useQuizCreation must be used within a QuizCreationProvider')
  }
  return context
}

