import { useState } from "react"
import {
  MoreHorizontal,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import { Button } from "@/components/shadcn/button"
import { Skeleton } from "@/components/shadcn/skeleton"
import { useTeacherQuizzes } from "@/hooks/useQuiz.hook"

export default function QuizTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, error } = useTeacherQuizzes(currentPage, pageSize)

  const quizzes = data?.quizzes || []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages || 1

  const handleDelete = (quizId: number) => {
    console.log('Delete quiz:', quizId)
    // TODO: Implement delete functionality
  }

  const toggleStatus = (quizId: number) => {
    console.log('Toggle status for quiz:', quizId)
    // TODO: Implement toggle status functionality
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white shadow overflow-hidden p-6">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border bg-white shadow overflow-hidden p-8 text-center">
        <p className="text-red-600 mb-4">Failed to load quizzes. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Empty state
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="rounded-xl border bg-white shadow overflow-hidden p-8 text-center">
        <p className="text-gray-600">No quizzes found. Create your first quiz to get started!</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white shadow overflow-hidden">
      <Table>
        <TableHeader 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59, 130, 246), rgb(6, 182, 212), rgb(37, 99, 235)),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'overlay',
            opacity: 0.85
          }}
        >
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="font-semibold text-white">Share Link</TableHead>
            <TableHead className="font-semibold text-white">Quiz Topic</TableHead>
            <TableHead className="font-semibold text-white">Total Responses</TableHead>
            <TableHead className="font-semibold text-white">Average Score</TableHead>
            <TableHead className="font-semibold text-white">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell className="font-medium font-mono text-sm">{quiz.shareLink}</TableCell>
              <TableCell>{quiz.topic}</TableCell>
              <TableCell>{quiz.totalResponses}</TableCell>
              <TableCell>
                {quiz.averageScore !== null ? `${quiz.averageScore.toFixed(1)}%` : 'N/A'}
              </TableCell>
              <TableCell>
                <span
                  onClick={() => toggleStatus(quiz.id)}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-all hover:scale-105 ${
                    quiz.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {quiz.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border rounded-lg px-4 py-1.5 text-sm min-w-[70px]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} {pagination && `(${pagination.total} total)`}
          </span>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

