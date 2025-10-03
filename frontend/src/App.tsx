import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import QuizReady from './pages/QuizReady'
import QuizGame from './pages/QuizGame'
import TeacherLobby from './pages/TeacherLobby'
import StudentJoin from './pages/StudentJoin'
import StudentLobby from './pages/StudentLobby'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/quiz-game' 
    && !location.pathname.includes('/teacher/lobby')
    && !location.pathname.includes('/student/lobby')
    && location.pathname !== '/join'
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/quiz-ready" element={<QuizReady />} />
        <Route path="/quiz-game" element={<QuizGame />} />
        <Route path="/teacher/lobby/:pin" element={<TeacherLobby />} />
        <Route path="/join" element={<StudentJoin />} />
        <Route path="/student/lobby/:pin" element={<StudentLobby />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

