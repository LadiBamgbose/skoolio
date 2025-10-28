import type { QuizTypes } from '@/types/quiz.types'

interface QuestionsTabProps {
  quizDetails: QuizTypes.QuizDetailsResponse | undefined
  isLoading: boolean
}

export default function QuestionsTab({ quizDetails, isLoading }: QuestionsTabProps) {
  if (isLoading) {
    return <p className="text-gray-600 italic">Loading questions...</p>
  }

  if (!quizDetails?.quiz.questions || quizDetails.quiz.questions.length === 0) {
    return <p className="text-gray-600 italic">No questions found</p>
  }

  return (
    <div className="space-y-6">
      {quizDetails.quiz.questions.map((question, index) => (
        <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Question {index + 1}: {question.question}
          </h4>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`p-3 rounded-lg border ${
                  option === question.correctAnswer 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {option}
                {option === question.correctAnswer && (
                  <span className="ml-2 text-sm font-medium">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
          {question.explanation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

