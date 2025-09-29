import { motion } from 'framer-motion'

interface QuizFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  gamePin: string;
}

export default function QuizFooter({ currentQuestion, totalQuestions, gamePin }: QuizFooterProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl px-4 md:px-8 py-4 md:py-6 mx-4 md:mx-6 mb-4 md:mb-6 flex items-center justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* Question Counter */}
      <div 
        className="font-bold text-lg md:text-2xl"
        style={{ 
          background: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {currentQuestion}/{totalQuestions}
      </div>

      {/* Game PIN */}
      <div 
        className="font-bold text-sm md:text-xl flex items-center gap-1 md:gap-3"
        style={{ 
          background: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        <span>skoolio.com Game PIN:</span>
        <span className="text-lg md:text-2xl">{gamePin}</span>
      </div>
    </motion.div>
  )
}
