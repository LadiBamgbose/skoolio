import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useState } from 'react'
import SignUpModal from '../components/SignUpModal'

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizReady() {
  const location = useLocation()
  const topic = location.state?.topic || 'Your Topic'
  const questions: Question[] = location.state?.questions || []
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 pt-20">
      <motion.div 
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        {/* Main Heading */}
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your Quiz is Ready!
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-600 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          We've created an interactive quiz game for <span className="font-semibold text-cyan-600">"{topic}"</span>
        </motion.p>

        {/* Quiz Preview Card */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="rounded-2xl shadow-lg min-h-[400px] max-w-2xl mx-auto p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)",
              backgroundSize: "400% 400%"
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
          >
            {/* Blurred content directly on gradient */}
            <div className="filter blur-sm">
              <h3 className="text-3xl font-bold text-white mb-8">
                {topic} Quiz Game
              </h3>
              
              <div className="space-y-6 text-left max-w-md">
                {questions.slice(0, 2).map((question, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Question {index + 1}</h4>
                    <p className="text-white/90">{question.question}</p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="text-sm text-white/80">
                          {String.fromCharCode(65 + optionIndex)}) {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Show fallback if no questions */}
                {questions.length === 0 && (
                  <>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Question 1</h4>
                      <p className="text-white/90">Sample question about {topic}...</p>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-white/80">A) Option A</div>
                        <div className="text-sm text-white/80">B) Option B</div>
                        <div className="text-sm text-white/80">C) Option C</div>
                        <div className="text-sm text-white/80">D) Option D</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Question 2</h4>
                      <p className="text-white/90">Another sample question...</p>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-white/80">A) Option A</div>
                        <div className="text-sm text-white/80">B) Option B</div>
                        <div className="text-sm text-white/80">C) Option C</div>
                        <div className="text-sm text-white/80">D) Option D</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Start Quiz Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            className="px-12 py-4 text-white rounded-xl font-medium shadow-lg flex items-center gap-3 justify-center opacity-60 text-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)"
            }}
            whileHover={{ 
              scale: 1.05,
              background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSignUpModal(true)}
          >
            <Play className="w-6 h-6" />
            Start Quiz Game
          </motion.button>
        </motion.div>
      </motion.div>
      
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        triggerAction="quiz"
      />
    </div>
  )
}
