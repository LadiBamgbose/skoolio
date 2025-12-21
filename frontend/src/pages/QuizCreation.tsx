import { useEffect } from 'react'
import { useQuizCreation } from '../contexts/QuizCreationContext'
import LoadingAnimation from '../components/quizCreation/LoadingAnimation'
import QuizResults from '../components/quizCreation/QuizResults'
import { trackEvent } from '../services/mixpanel'

export default function QuizCreation() {
  const { status, quiz, error } = useQuizCreation()

  useEffect(() => {
    trackEvent('Quiz Creation viewed')
  }, [])

  // Idle state - show placeholder
  if (status === 'idle') {
    return (
      <div className="h-full bg-gradient-to-b from-white via-cyan-100 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent opacity-60 mb-6">
            Ready to Create a Quiz?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Fill in the details in the sidebar to generate your quiz
          </p>
        </div>
      </div>
    )
  }

  // Loading state - show Skoolio animation
  if (status === 'loading') {
    return <LoadingAnimation />
  }

  // Success state - show quiz results
  if (status === 'success' && quiz) {
    return <QuizResults quiz={quiz} />
  }

  // Error state - show error message
  if (status === 'error') {
    return (
      <div className="h-full bg-gradient-to-b from-white via-cyan-100 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
            Oops!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {error || 'Failed to generate quiz. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
}

