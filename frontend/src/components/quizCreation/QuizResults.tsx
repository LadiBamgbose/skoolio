import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import QuizCard from '../quiz-generation/QuizCard'
import ShareModal from '../quiz-generation/ShareModal'
import { useQuizCreation } from '../../contexts/QuizCreationContext'

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

interface QuizResultsProps {
  quiz: Quiz
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

export default function QuizResults({ quiz }: QuizResultsProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const { resetQuiz } = useQuizCreation()

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleCloseShareModal = () => {
    setShowShareModal(false)
    resetQuiz()
  }

  return (
    <div className="h-full bg-gradient-to-b from-white via-cyan-100 to-white relative overflow-hidden">
      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto pb-24 px-8 pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz List */}
          <div className="space-y-8">
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
        </div>
      </div>

      {/* Fixed Share Button at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center py-6 bg-gradient-to-t from-white via-white/90 to-transparent">
        <motion.button 
          onClick={handleShare}
          className="px-8 py-3 text-white font-semibold rounded-xl shadow-lg"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246)),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'overlay'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Share Quiz
        </motion.button>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={handleCloseShareModal}
        shareLink={quiz.shareLink}
      />
    </div>
  )
}

