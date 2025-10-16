import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import QuizCard from '../components/quiz-generation/QuizCard'
import ShareModal from '../components/quiz-generation/ShareModal'

interface Question {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface AnimatedQuizItemProps {
  children: React.ReactNode
}

function AnimatedQuizItem({ children }: AnimatedQuizItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5, once: false })
  
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mb-8"
    >
      {children}
    </motion.div>
  )
}

export default function QuizGeneration() {
  const location = useLocation()
  const navigate = useNavigate()
  const quiz = location.state?.quiz
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  // Redirect if no quiz data
  if (!quiz) {
    navigate('/', { replace: true })
    return null
  }

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    container: scrollRef
  })
  
  const scrollHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const handleShare = () => {
    setShowShareModal(true)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-cyan-100 via-purple-50 to-purple-200 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl w-full h-[90vh] flex flex-col relative">
        {/* Scrollable Quiz List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 pr-8 mr-8 scrollbar-none"
        >
          {quiz.questions.map((question: Question, index: number) => (
            <AnimatedQuizItem key={index}>
              <QuizCard
                question={question.question}
                options={question.options}
                correctAnswer={question.correctAnswer}
                questionNumber={index + 1}
              />
            </AnimatedQuizItem>
          ))}
        </div>

        {/* Custom Gradient Scrollbar */}
        <div className="absolute right-4 top-6 bottom-20 w-3 bg-gray-300/50 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-500 rounded-full"
            style={{ height: scrollHeight }}
          />
        </div>

        {/* Share Button */}
        <motion.div
          className="flex justify-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={handleShare}
            className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 text-gray-800 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Share Quiz
          </button>
        </motion.div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareLink={quiz.shareLink}
      />
    </div>
  )
}

