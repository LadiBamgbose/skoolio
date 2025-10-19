import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/shared/Navbar'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import QuizGeneration from './pages/QuizGeneration'
import StudentQuiz from './pages/StudentQuiz'
import TeacherDashboard from './pages/TeacherDashboard'

function AppContent() {
  const location = useLocation()
  const isStudentQuiz = location.pathname.startsWith('/quiz/')
  const isTeacherDashboard = location.pathname.startsWith('/teacher/')

  return (
    <div className="min-h-screen overflow-x-hidden">
      {!isStudentQuiz && !isTeacherDashboard && <Navbar />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/quiz-generation" element={<QuizGeneration />} />
          <Route path="/quiz/:shareLink" element={<StudentQuiz />} />
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App

