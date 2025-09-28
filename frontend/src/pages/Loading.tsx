import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DemoQuizService from '../services/demoQuizService'

export default function Loading() {
  const navigate = useNavigate()
  const location = useLocation()
  const topic = location.state?.topic || 'your topic'
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        // Step 1: Analyzing topic
        setCurrentStep(0)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Step 2: Creating questions
        setCurrentStep(1)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Step 3: Generate actual quiz
        setCurrentStep(2)
        const quizData = await DemoQuizService.generateDemoQuiz(topic)
        
        // Navigate to quiz ready with the generated quiz
        navigate('/quiz-ready', { 
          state: { 
            topic,
            quiz: quizData.quiz,
            questions: quizData.questions 
          } 
        })
        
      } catch (error) {
        console.error('Error generating quiz:', error)
        // Navigate back to home with error
        navigate('/', { 
          state: { 
            error: 'Failed to generate quiz. Please try again.' 
          } 
        })
      }
    }

    generateQuiz()
  }, [navigate, topic])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 pt-20">
      <motion.div 
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Loading Animation */}
        <motion.div
          className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Loading Text */}
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Creating your quiz...
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Generating questions for <span className="font-semibold text-cyan-600">"{topic}"</span>
        </motion.p>

        {/* Progress Steps */}
        <div className="space-y-3">
          {[
            "Analyzing your topic...",
            "Creating engaging questions...",
            "Setting up your quiz game..."
          ].map((step, index) => (
            <motion.div
              key={step}
              className={`flex items-center justify-center gap-3 ${
                index <= currentStep ? 'text-cyan-600' : 'text-gray-400'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
                animate={index === currentStep ? { scale: [1, 1.5, 1] } : {}}
                transition={{ 
                  duration: 0.6,
                  repeat: index === currentStep ? Infinity : 0,
                  repeatDelay: 0.5
                }}
              />
              <span className={index <= currentStep ? 'font-medium' : ''}>{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
