import { motion } from 'framer-motion'
import Timer from './Timer'
import AnswersCount from './AnswersCount'

interface QuizMidSectionProps {
  timeLeft: number;
  answersCount: number;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizMidSection({ timeLeft, answersCount, questionNumber, totalQuestions }: QuizMidSectionProps) {
  return (
    <motion.div 
      className="flex items-center justify-between px-2 md:px-6 mt-8 md:mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Skip Button */}
      <motion.button 
        className="w-18 h-12 md:w-32 md:h-16 rounded-2xl flex items-center justify-center font-bold text-sm md:text-lg bg-white"
        style={{
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3), 0 8px 40px rgba(6, 182, 212, 0.2), 0 12px 60px rgba(37, 99, 235, 0.1)',
          background: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Skip
      </motion.button>

      {/* Timer */}
      <div className="flex-1 flex justify-center">
        <Timer initialTime={timeLeft} />
      </div>

      {/* Answers Count */}
      <AnswersCount count={answersCount} />
    </motion.div>
  )
}
