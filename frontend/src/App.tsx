import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import QuizReady from './pages/QuizReady'

function App() {
  return (
    <Router>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/quiz-ready" element={<QuizReady />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

