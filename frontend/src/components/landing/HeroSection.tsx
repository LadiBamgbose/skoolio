import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUp, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import SignUpModal from '../shared/SignUpModal'

const gradeLevels = [
  { id: 'k', name: 'K' },
  { id: '1', name: '1st Grade' },
  { id: '2', name: '2nd Grade' },
  { id: '3', name: '3rd Grade' },
  { id: '4', name: '4th Grade' },
  { id: '5', name: '5th Grade' },
  { id: '6', name: '6th Grade' },
  { id: '7', name: '7th Grade' },
  { id: '8', name: '8th Grade' },
  { id: '9', name: '9th Grade' },
  { id: '10', name: '10th Grade' },
  { id: '11', name: '11th Grade' },
  { id: '12', name: '12th Grade' },
]

const questionCounts = [
  { id: 10, name: '10 Questions' },
  { id: 15, name: '15 Questions' },
  { id: 20, name: '20 Questions' },
  { id: 25, name: '25 Questions' },
  { id: 30, name: '30 Questions' },
]

export default function HeroSection() {
  const [topic, setTopic] = useState('')
  const [gradeLevel, setGradeLevel] = useState(gradeLevels[5]) // Default to 6th grade
  const [questionCount, setQuestionCount] = useState(questionCounts[0]) // Default to 5
  const [error, setError] = useState('')
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [signUpTrigger, setSignUpTrigger] = useState<string | undefined>(undefined)
  const isTeacherPlan = false // TODO: Get from auth context
  const navigate = useNavigate()
  const location = useLocation()

  // Check for error messages from navigation
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
      // Clear the error from location state
      navigate(location.pathname, { replace: true })
    }
    
    // Check if we should open signup modal (rate limit reached)
    if (location.state?.showSignUpModal) {
      setSignUpTrigger('demo-limit')
      setShowSignUpModal(true)
      // Clear the flag from location state
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

  const handleQuestionCountChange = (newCount: typeof questionCounts[0]) => {
    if (!isTeacherPlan) {
      setShowSignUpModal(true)
      return
    }
    setQuestionCount(newCount)
  }

  const handleGenerateGame = () => {
    // Clear previous errors
    setError('')

    // Validate: Check if topic is empty
    if (!topic.trim()) {
      setError('Please enter a topic or lesson text')
      return
    }

    // Validate: Check if topic is > 500 characters
    if (topic.trim().length > 500) {
      setError('Topic must be less than 500 characters')
      return
    }

    // Navigate to loading screen with validated data
    navigate('/loading', { 
      state: { 
        topic: topic.trim(), 
        gradeLevel: gradeLevel.name,
        questionCount: questionCount.id 
      } 
    })
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
            Generate engaging classroom quizzes in seconds.
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
            Generate engaging classroom quizzes in seconds.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Text Area*/}
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
              onChange={(e) => {
                setTopic(e.target.value)
                // Clear error when user starts typing
                if (error) setError('')
              }}
              placeholder="Enter a topic or paste your lesson text…"
              className="w-full h-32 md:h-40 px-8 py-6 pr-[450px] pb-10 text-xl border-2 border-gray-200 rounded-2xl focus:border-cyan-400 focus:outline-none resize-none transition-colors duration-200 bg-white shadow-sm"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-3 left-3">
              <span className={`text-sm ${topic.length > 500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                {topic.length}/500
              </span>
            </div>
            
            {/* Dropdowns and Submit Button */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {/* Questions Dropdown */}
              <Listbox value={questionCount} onChange={handleQuestionCountChange}>
                <div className="relative">
                  <ListboxButton 
                    className="relative w-40 cursor-pointer rounded-xl py-3 pl-4 pr-10 text-left shadow-md backdrop-blur-sm transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.1))"
                    }}
                  >
                    <span className="block truncate font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {questionCount.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-5 w-5 text-cyan-500" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute bottom-full mb-2 max-h-60 w-40 overflow-auto rounded-xl bg-white/95 backdrop-blur-md py-1 shadow-lg ring-1 ring-cyan-200 focus:outline-none z-10">
                    {questionCounts.map((count) => (
                      <ListboxOption
                        key={count.id}
                        className="relative cursor-pointer select-none py-2 pl-4 pr-4 data-[focus]:bg-gradient-to-r data-[focus]:from-cyan-50 data-[focus]:to-blue-50 data-[focus]:text-cyan-900 text-gray-900"
                        value={count}
                      >
                        <span className="block truncate data-[selected]:font-semibold data-[selected]:text-cyan-600 font-normal">
                          {count.name}
                        </span>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

              {/* Grade Level Dropdown */}
              <Listbox value={gradeLevel} onChange={setGradeLevel}>
                <div className="relative">
                  <ListboxButton 
                    className="relative w-36 cursor-pointer rounded-xl py-3 pl-4 pr-10 text-left shadow-md backdrop-blur-sm transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.1))"
                    }}
                  >
                    <span className="block truncate font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {gradeLevel.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-5 w-5 text-cyan-500" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute bottom-full mb-2 max-h-60 w-36 overflow-auto rounded-xl bg-white/95 backdrop-blur-md py-1 shadow-lg ring-1 ring-cyan-200 focus:outline-none z-10">
                    {gradeLevels.map((level) => (
                      <ListboxOption
                        key={level.id}
                        className="relative cursor-pointer select-none py-2 pl-4 pr-4 data-[focus]:bg-gradient-to-r data-[focus]:from-cyan-50 data-[focus]:to-blue-50 data-[focus]:text-cyan-900 text-gray-900"
                        value={level}
                      >
                        <span className="block truncate data-[selected]:font-semibold data-[selected]:text-cyan-600 font-normal">
                          {level.name}
                        </span>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

              {/* Cyan gradient circle button */}
              <motion.button
                onClick={handleGenerateGame}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed opacity-60"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)"
                }}
                whileHover={{ 
                  scale: 1.1,
                  background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                disabled={!topic.trim()}
              >
                <ArrowUp className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sign Up Modal */}
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={() => {
          setShowSignUpModal(false)
          setSignUpTrigger(undefined)
        }}
        triggerAction={signUpTrigger}
      />
    </div>
  )
}
