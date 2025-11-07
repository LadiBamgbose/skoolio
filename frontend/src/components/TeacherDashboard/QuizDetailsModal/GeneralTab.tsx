import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizTypes } from '@/types/quiz.types'

interface GeneralTabProps {
  quiz: QuizTypes.TeacherQuiz
  localIsActive: boolean
  handleToggleStatus: () => void
  toggleStatusPending: boolean
  copyShareLink: () => void
  formatDate: (dateString: string) => string
}

export default function GeneralTab({
  quiz,
  localIsActive,
  handleToggleStatus,
  toggleStatusPending,
  copyShareLink,
  formatDate
}: GeneralTabProps) {
  return (
    <>
      {/* Status Badge - Clickable */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleStatus}
          disabled={toggleStatusPending}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            localIsActive 
              ? 'bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 border-2 border-red-200 hover:bg-red-200'
          }`}
        >
          {localIsActive ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Active
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              Inactive
            </>
          )}
        </button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Share Link:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-900">skoolio.app/quiz/{quiz.shareLink}</span>
            <button
              onClick={copyShareLink}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Grade Level:</span>
          <span className="text-sm font-semibold text-gray-900">{quiz.gradeLevel}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Number of Questions:</span>
          <span className="text-sm font-semibold text-gray-900">{quiz.questionCount}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Created:</span>
          <span className="text-sm text-gray-900">{formatDate(quiz.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Responses:</span>
          <span className="text-sm font-semibold text-gray-900">{quiz.totalResponses}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Average Score:</span>
          <span className="text-sm font-semibold text-gray-900">
            {quiz.averageScore !== null ? `${quiz.averageScore.toFixed(1)}%` : 'N/A'}
          </span>
        </div>
      </div>
    </>
  )
}

