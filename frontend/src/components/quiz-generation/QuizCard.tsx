import { motion } from 'framer-motion'

interface QuizCardProps {
  question: string
  options: string[]
  correctAnswer?: string
  questionNumber: number
}

export default function QuizCard({ question, options, correctAnswer, questionNumber }: QuizCardProps) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question Number and Text */}
      <div className="mb-6">
        <span className="text-gray-500 font-medium text-lg">{questionNumber}.</span>
        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{question}</h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 transition-colors ${
              correctAnswer && option === correctAnswer
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <span className="text-lg text-gray-800">{option}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

