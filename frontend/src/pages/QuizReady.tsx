import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.css'

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

// Question Card Component with flip functionality
function QuestionCard({ question, index }: { question: Question; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className="relative w-full h-[600px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '2000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card - Question */}
        <div
          className="absolute w-full h-full bg-white/10 backdrop-blur-sm border border-gray-600 rounded-2xl shadow-xl p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full">
                Question {index + 1}
              </span>
              <span className="text-xs text-gray-300">Tap to reveal answer</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">
              {question.question}
            </h3>
            
            <div className="space-y-5">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="p-5 bg-white/5 rounded-lg border border-gray-500 hover:border-gray-400 transition-colors"
                >
                  <span className="font-medium text-gray-200">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back of card - Answer */}
        <div
          className="absolute w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 flex flex-col justify-start items-center text-white"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-6">Correct Answer</h3>
            <div className="text-xl font-semibold mb-8 bg-white/20 rounded-lg p-4 max-w-sm mx-auto">
              {question.correct}
            </div>
            
            {question.explanation && (
              <div className="text-white/90 leading-relaxed mb-8 max-w-md mx-auto">
                <p>{question.explanation}</p>
              </div>
            )}
            
            <p className="text-white/60 text-sm">Tap to return to question</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function QuizReady() {
  const location = useLocation()
  const topic = location.state?.topic || 'Your Topic'
  const questions: Question[] = location.state?.questions || []


  return (
    <div className="min-h-screen bg-black px-4 pt-20 relative">
      {/* Brand gradient stripe */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1d4ed8] via-[#22d3ee] via-[#1e40af] to-transparent opacity-40"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 capitalize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {topic}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {questions.length} Questions
          </motion.p>
        </motion.div>

        {/* Question Cards Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          {questions.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination-custom',
                }}
                className="quiz-swiper"
              >
              {questions.map((question, index) => (
                <SwiperSlide key={index}>
                  <QuestionCard question={question} index={index} />
                </SwiperSlide>
              ))}
              </Swiper>
              
              {/* Custom Navigation Arrows */}
              <div className="swiper-button-prev-custom absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="swiper-button-next-custom absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Custom Pagination Dots */}
              <div className="swiper-pagination-custom flex justify-center mt-8 space-x-2"></div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No questions available</p>
              <p className="text-sm text-gray-400">Please go back and generate a new quiz</p>
            </div>
          )}
        </motion.div>

        {/* Start Game Button */}
        {questions.length > 0 && (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              className="px-12 py-4 text-white rounded-xl font-medium shadow-lg flex items-center gap-3 justify-center text-lg"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
              }}
              whileHover={{ 
                scale: 1.05,
                background: "linear-gradient(135deg, #1e40af, #06b6d4, #1e3a8a)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // TODO: Start game functionality
                console.log('Starting game...')
              }}
            >
              <Play className="w-6 h-6" />
              Start Game
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
