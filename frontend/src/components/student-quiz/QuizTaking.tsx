import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, Trophy } from 'lucide-react'
import QuizService from '../../services/quizService'

interface Question {
  question: string
  options: string[]
  correctAnswer?: string
}

interface Quiz {
  id: number
  topic: string
  gradeLevel: string
  questions: Question[]
}

interface QuizTakingProps {
  studentName: string
  quiz: Quiz
  shareLink: string
}

export default function QuizTaking({ studentName, quiz }: QuizTakingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [startTime] = useState(Date.now())

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNext = async () => {
    if (!selectedAnswer) return

    const newAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer }
    setAnswers(newAnswers)

    if (isLastQuestion) {
      // Submit quiz
      setSubmitting(true)
      try {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000) // seconds
        const response = await QuizService.submitQuiz(
          quiz.id,
          studentName,
          newAnswers,
          timeTaken
        )
        setResult(response.response)
        setIsComplete(true)
      } catch (error) {
        console.error('Error submitting quiz:', error)
        alert('Failed to submit quiz. Please try again.')
      } finally {
        setSubmitting(false)
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    }
  }

  if (isComplete && result) {
    const percentage = result.percentage

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Trophy className="w-14 h-14 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Great Job, {studentName}!
            </h2>

            <p className="text-gray-600 mb-8">
              You completed the quiz
            </p>

            <div className="bg-cyan-50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-cyan-600 mb-2">
                {percentage}%
              </div>
              <p className="text-gray-700 font-medium">
                {result.score} out of {result.totalQuestions} correct
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Your teacher will review your results
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{studentName}</h1>
              <p className="text-sm text-gray-500">{quiz.topic}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-cyan-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-24">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
            >
              {/* Question */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedAnswer === option
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 bg-gray-50 hover:border-cyan-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-lg text-gray-800 font-medium">
                        {option}
                      </span>
                      {selectedAnswer === option && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-cyan-600" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || submitting}
            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              selectedAnswer && !submitting
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

