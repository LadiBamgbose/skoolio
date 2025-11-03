import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/shared/Navbar'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import QuizGeneration from './pages/QuizGeneration'
import StudentQuiz from './pages/StudentQuiz'
import TeacherDashboard from './pages/TeacherDashboard'
import QuizCreation from './pages/QuizCreation'
import Settings from './pages/Settings'
import BillingSuccess from './pages/BillingSuccess'
import BillingCancel from './pages/BillingCancel'
import DashboardLayout from './layouts/DashboardLayout'

function AppContent() {
  const location = useLocation()
  const isStudentQuiz = location.pathname.startsWith('/quiz/')
  const isTeacherDashboard = location.pathname.startsWith('/teacher/')

  return (
    <div className={isTeacherDashboard ? "h-screen overflow-hidden" : "min-h-screen overflow-x-hidden"}>
      {!isStudentQuiz && !isTeacherDashboard && <Navbar />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/quiz-generation" element={<QuizGeneration />} />
          <Route path="/quiz/:shareLink" element={<StudentQuiz />} />
          
          {/* Billing routes */}
          <Route path="/billing/success" element={<BillingSuccess />} />
          <Route path="/billing/cancel" element={<BillingCancel />} />
          
          {/* Teacher routes with shared layout */}
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="quiz" element={<QuizCreation />} />
            <Route path="settings" element={<Settings />} />
          </Route>
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

