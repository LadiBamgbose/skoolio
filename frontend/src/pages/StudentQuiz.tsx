import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NameEntry from '../components/student-quiz/NameEntry'
import QuizTaking from '../components/student-quiz/QuizTaking'
import QuizService from '../services/quizService'
import { trackEvent } from '../services/mixpanel'

export default function StudentQuiz() {
  const { shareLink } = useParams<{ shareLink: string }>()
  const navigate = useNavigate()
  const [studentName, setStudentName] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    trackEvent('Student Quiz viewed', {
      shareLink: shareLink
    })
  }, [shareLink])

  useEffect(() => {
    if (!shareLink) {
      navigate('/')
      return
    }

    // Fetch quiz data
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const response = await QuizService.getQuizByShareLink(shareLink)
        setQuiz(response.quiz)
      } catch (err: any) {
        console.error('Error fetching quiz:', err)
        setError(err.message || 'Quiz not found')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [shareLink, navigate])

  const handleStartQuiz = (name: string) => {
    setStudentName(name)
    setHasStarted(true)
    
    // Track quiz started in Mixpanel
    trackEvent('Quiz Started', {
      quizId: quiz.id,
      quizTopic: quiz.topic,
      gradeLevel: quiz.gradeLevel,
      questionCount: quiz.questions?.length,
      teacherId: quiz.teacherId,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">
            This quiz link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100">
      {!hasStarted ? (
        <NameEntry onStart={handleStartQuiz} quizTopic={quiz.topic} />
      ) : (
        <QuizTaking 
          studentName={studentName}
          quiz={quiz}
          shareLink={shareLink!}
        />
      )}
    </div>
  )
}

