import { motion } from 'framer-motion'
import { useState } from 'react'

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
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
