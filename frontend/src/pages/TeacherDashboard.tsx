import { useEffect } from 'react'
import StatsCard from "@/components/TeacherDashboard/StatsCard"
import QuizTable from "@/components/TeacherDashboard/QuizTable"
import { useTeacherStats, useQuizUsage } from "@/hooks/useQuiz.hook"
import { Skeleton } from "@/components/shadcn/skeleton"
import { useNavigate } from "react-router-dom"
import { trackEvent } from '../services/mixpanel'
import BugReportButton from '../components/shared/BugReportButton'

export default function TeacherDashboard() {
  const { data, isLoading, error } = useTeacherStats()
  const { data: usageData, isLoading: isLoadingUsage } = useQuizUsage()
  const navigate = useNavigate()

  useEffect(() => {
    trackEvent('Teacher Dashboard viewed')
  }, [])

  const usage = usageData?.usage
  console.log(usage)

  const handleUpgrade = () => {
    // Navigate to landing page with pricing section
    navigate('/')
  }

  return (
    <div className="p-8 space-y-6 relative">
      <BugReportButton
        onClick={() => {
          // Placeholder for now
          console.log('Bug report clicked')
        }}
      />

      {/* Usage Counter Card */}
      {!isLoadingUsage && usage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {usage.plan === 'BASIC' ? 'Free Plan' : usage.plan === 'TEACHER' ? 'Teacher Plan' : 'Advanced Plan'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {usage.remaining > 0 ? (
                  <>
                    {usage.remaining} quiz{usage.remaining !== 1 ? 'es' : ''} remaining this billing period
                  </>
                ) : (
                  <span className="font-semibold text-red-600">Limit reached. Upgrade to generate more.</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                usage.remaining === 0 ? 'text-red-600' :
                usage.remaining <= 2 ? 'text-red-500' : 
                usage.remaining <= 5 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {usage.used}<span className="text-gray-400">/{usage.limit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Quizzes used</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                usage.remaining === 0 ? 'bg-red-500' :
                usage.remaining <= 2 ? 'bg-red-400' : 
                usage.remaining <= 5 ? 'bg-yellow-400' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` }}
            />
          </div>

          {/* Upgrade button for users at or near limit */}
          {usage.remaining <= 5 && usage.plan !== 'ADVANCED' && (
            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
            >
              {usage.remaining === 0 
                ? (usage.plan === 'BASIC' ? 'Upgrade to Teacher Plan' : 'Upgrade to Advanced Plan')
                : 'Upgrade for More Quizzes'
              }
            </button>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </>
        ) : error ? (
          <div className="col-span-3 text-center text-red-600">
            Failed to load statistics. Please try again.
          </div>
        ) : (
          <>
            <StatsCard 
              title="Total Quizzes"
              value={data?.stats.totalQuizzes || 0}
            />
            <StatsCard 
              title="Active Quizzes"
              value={data?.stats.activeQuizzes || 0}
            />
            <StatsCard 
              title="Inactive Quizzes"
              value={data?.stats.inactiveQuizzes || 0}
            />
          </>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Quizzes</h2>
        <QuizTable />
      </div>
    </div>
  )
}
