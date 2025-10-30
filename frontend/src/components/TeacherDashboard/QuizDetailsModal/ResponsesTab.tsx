import type { QuizTypes } from '@/types/quiz.types'

interface ResponsesTabProps {
  responsesData: QuizTypes.QuizResponsesResponse | undefined
  isLoading: boolean
}

export default function ResponsesTab({ responsesData, isLoading }: ResponsesTabProps) {
  if (isLoading) {
    return <p className="text-gray-600 italic">Loading responses...</p>
  }

  if (!responsesData?.responses || responsesData.responses.length === 0) {
    return <p className="text-gray-600 italic">No responses found</p>
  }

  return (
    <>
      {/* Filter Dropdown */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700">Filter by Student:</label>
        <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none min-w-[200px]">
          <option value="">All Students</option>
          {Array.from(new Set(responsesData.responses.map(r => r.studentName))).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      
      {/* Responses List */}
      <div className="space-y-4">
        {responsesData.responses.map((response, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {response.studentName}
              </h4>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Score: {response.score}/{response.totalQuestions}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (response.score / response.totalQuestions) >= 0.7
                    ? 'bg-green-100 text-green-800'
                    : (response.score / response.totalQuestions) >= 0.5
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {Math.round((response.score / response.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Completed: {new Date(response.completedAt).toLocaleString()}
              {response.timeTaken && (
                <span className="ml-4">
                  Time: {Math.round(response.timeTaken / 60)} minutes
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

