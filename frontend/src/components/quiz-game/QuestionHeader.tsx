import { motion } from 'framer-motion'

interface QuestionHeaderProps {
  question: string;
}

export default function QuestionHeader({ question }: QuestionHeaderProps) {
  return (
    <motion.div 
      className="px-4 md:px-8 py-4 md:py-6 rounded-2xl shadow-lg w-[95%] md:w-[98%] mx-auto mt-4 md:mt-8"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-3xl md:text-5xl font-bold text-center leading-tight"
        style={{ 
          background: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {question}
      </motion.h1>
    </motion.div>
  )
}
