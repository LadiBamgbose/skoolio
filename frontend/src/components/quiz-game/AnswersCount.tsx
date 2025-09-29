import { motion } from 'framer-motion'

interface AnswersCountProps {
  count: number;
}

export default function AnswersCount({ count }: AnswersCountProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <motion.div 
        className="text-2xl md:text-4xl font-bold"
        style={{ 
          background: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        animate={{ scale: count > 0 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}
      </motion.div>
      <div className="text-xs md:text-sm text-gray-600 font-medium">
        Answers
      </div>
    </motion.div>
  )
}
