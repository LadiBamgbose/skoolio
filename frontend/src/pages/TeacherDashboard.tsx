import StatsCard from "@/components/TeacherDashboard/StatsCard"
import QuizTable from "@/components/TeacherDashboard/QuizTable"
import { useTeacherStats } from "@/hooks/useQuiz.hook"
import { Skeleton } from "@/components/shadcn/skeleton"

export default function TeacherDashboard() {
  const { data, isLoading, error } = useTeacherStats()

  return (
    <>
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
    </>
  )
}
