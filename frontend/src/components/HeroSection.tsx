import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
// import DemoQuizService from '../services/demoQuizService' // Removed to debug

export default function HeroSection() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Check for error messages from navigation
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
      // Clear the error from location state
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

  const handleGenerateGame = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setError('') // Clear any previous errors
    
    try {
      // Temporarily skip API call to test if this is still the issue
      console.log('Generating game for topic:', topic.trim())
      
      // Navigate to loading screen with topic
      navigate('/loading', { state: { topic: topic.trim() } })
      
    } catch (error) {
      console.error('Error:', error)
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-white via-cyan-100 to-white py-16 px-4">
      {/* Top Header with Skoolio */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          damping: 10,
          stiffness: 100,
          delay: 0.2
        }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent opacity-60"  
          animate={{
            y: [0, -20, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Skoolio
        </motion.h1>
        
        {/* Subtitle - Right below Skoolio */}
        <motion.div className="relative mt-4">
          {/* Base text with static gradient */}
          <motion.p 
            className="text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent leading-relaxed"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Turn any topic into a live classroom game in seconds.
          </motion.p>
          
          {/* Moving shimmer overlay */}
          <motion.p 
            className="absolute inset-0 text-2xl md:text-3xl lg:text-4xl bg-clip-text text-transparent leading-relaxed pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%)",
              backgroundSize: "200% 100%",
              fontFamily: 'Poppins, sans-serif'
            }}
            initial={{ backgroundPosition: "200% 0" }}
            animate={{ backgroundPosition: "-200% 0" }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
              delay: 0
            }}
          >
            Turn any topic into a live classroom game in seconds.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="w-full max-w-6xl px-8 mx-auto text-center flex flex-col items-center justify-center min-h-[50vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
      >
        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}

        {/* Input Section */}
        <motion.div 
          className="w-full space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic or paste your lesson text…"
              className="w-full h-32 md:h-40 px-8 py-6 pr-16 text-xl border-2 border-gray-200 rounded-2xl focus:border-cyan-400 focus:outline-none resize-none transition-colors duration-200 bg-white shadow-sm"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Cyan gradient circle button */}
            <motion.button
              onClick={handleGenerateGame}
              className="absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed opacity-60"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)"
              }}
              whileHover={{ 
                scale: 1.1,
                background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              disabled={!topic.trim() || isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <ArrowUp className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
