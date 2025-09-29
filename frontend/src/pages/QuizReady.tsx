import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import QuestionCard from '../components/quiz-ready/QuestionCard'

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export default function QuizReady() {
  const location = useLocation()
  const navigate = useNavigate()
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 capitalize leading-tight"
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
                // Navigate to quiz game with questions data
                navigate('/quiz-game', {
                  state: {
                    topic,
                    questions
                  }
                })
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
