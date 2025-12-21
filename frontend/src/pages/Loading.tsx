import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import QuizService from '../services/quizService'
import { trackEvent } from '../services/mixpanel'

export default function Loading() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    trackEvent('Loading viewed')
  }, [])

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        // Get data from navigation state
        const { topic, gradeLevel, questionCount } = location.state || {}

        // Validate we have the required data
        if (!topic || !gradeLevel || !questionCount) {
          navigate('/', { 
            state: { error: 'Missing quiz parameters. Please try again.' },
            replace: true 
          })
          return
        }

        // Call backend to generate quiz
        const response = await QuizService.generateQuiz(topic, gradeLevel, questionCount)

        // Navigate to quiz generation page with the quiz data
        navigate('/quiz-generation', { 
          state: { quiz: response.quiz },
          replace: true 
        })

      } catch (error: any) {
        console.error('Quiz generation failed:', error)
        
        // Check if it's a rate limit error (for anonymous users)
        const isRateLimitError = error?.response?.data?.rateLimitReached === true
        
        // Handle specific error cases
        let errorMessage = 'Failed to generate quiz. Please try again.'
        
        if (error?.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error?.message) {
          errorMessage = error.message
        }

        // Navigate back to home with error
        navigate('/', { 
          state: { 
            error: errorMessage,
            showSignUpModal: isRateLimitError // Trigger signup modal if rate limit
          },
          replace: true 
        })
      }
    }

    generateQuiz()
  }, [navigate, location.state])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50 to-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo/Text */}
        <motion.h1
          className="text-9xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Skoolio
        </motion.h1>

        {/* Animated Dots */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Status Text */}
        <motion.p
          className="mt-8 text-3xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Generating your quiz...
        </motion.p>
      </div>
    </div>
  )
}

