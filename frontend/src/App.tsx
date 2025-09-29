import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import QuizReady from './pages/QuizReady'
import QuizGame from './pages/QuizGame'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/quiz-game'
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/quiz-ready" element={<QuizReady />} />
        <Route path="/quiz-game" element={<QuizGame />} />
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

