import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TimerProps {
  initialTime?: number;
  onTimeUp?: () => void;
}

export default function Timer({ initialTime = 30, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onTimeUp?.()
    }
  }, [timeLeft, onTimeUp])

  return (
    <motion.div 
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-60 h-60 md:w-110 md:h-110 rounded-full flex items-center justify-center text-3xl md:text-6xl font-bold text-white"
        style={{
          background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
        }}
        animate={{
          background: [
            'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
            'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)', 
            'linear-gradient(135deg, #8b5cf6, #06b6d4, #3b82f6)',
            'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {timeLeft}
      </motion.div>
    </motion.div>
  )
}
