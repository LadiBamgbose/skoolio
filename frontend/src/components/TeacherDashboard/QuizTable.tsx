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

interface Quiz {
  id: string
  topic: string
  totalResponses: number
  averageScore: number
  status: 'Active' | 'Inactive'
}

// Dummy data
const initialQuizzes: Quiz[] = [
  { id: "QZ-001", topic: "Math: Algebra Basics", totalResponses: 45, averageScore: 78.5, status: "Active" },
  { id: "QZ-002", topic: "Science: Photosynthesis", totalResponses: 32, averageScore: 85.2, status: "Active" },
  { id: "QZ-003", topic: "History: World War II", totalResponses: 28, averageScore: 72.8, status: "Inactive" },
  { id: "QZ-004", topic: "English: Shakespeare", totalResponses: 51, averageScore: 88.3, status: "Active" },
  { id: "QZ-005", topic: "Geography: Continents", totalResponses: 19, averageScore: 65.4, status: "Inactive" },
]

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.ceil(quizzes.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentQuizzes = quizzes.slice(startIndex, endIndex)

  const handleDelete = (quizId: string) => {
    console.log('Delete quiz:', quizId)
    // TODO: Implement delete functionality
  }

  const toggleStatus = (quizId: string) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === quizId
          ? { ...quiz, status: quiz.status === 'Active' ? 'Inactive' : 'Active' }
          : quiz
      )
    )
  }

  return (
    <div className="rounded-xl border bg-white shadow overflow-hidden">
      <Table>
        <TableHeader className="bg-cyan-50">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="font-semibold text-gray-700">Quiz ID</TableHead>
            <TableHead className="font-semibold text-gray-700">Quiz Topic</TableHead>
            <TableHead className="font-semibold text-gray-700">Total Responses</TableHead>
            <TableHead className="font-semibold text-gray-700">Average Score</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentQuizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell className="font-medium">{quiz.id}</TableCell>
              <TableCell>{quiz.topic}</TableCell>
              <TableCell>{quiz.totalResponses}</TableCell>
              <TableCell>{quiz.averageScore}%</TableCell>
              <TableCell>
                <span
                  onClick={() => toggleStatus(quiz.id)}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-all hover:scale-105 ${
                    quiz.status === 'Active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {quiz.status}
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
            Page {currentPage} of {totalPages}
          </span>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
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

