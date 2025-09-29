import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import QuestionHeader from '../components/quiz-game/QuestionHeader'
import QuizMidSection from '../components/quiz-game/QuizMidSection'
import AnswerOptions from '../components/quiz-game/AnswerOptions'
import QuizFooter from '../components/quiz-game/QuizFooter'

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export default function QuizGame() {
  const location = useLocation()
  const questions: Question[] = location.state?.questions || []
  const currentQuestion = questions[0] || { question: "Sample question?", options: ["A", "B", "C", "D"], correct: "A" }
  
  const [answersCount, setAnswersCount] = useState(0)
  const [currentQuestionIndex] = useState(0)
  const [gamePin] = useState("123456")

  return (
    <div className="h-screen bg-white flex flex-col justify-between">
      <QuestionHeader question={currentQuestion.question} />
      <QuizMidSection 
        timeLeft={30}
        answersCount={answersCount}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      <div className="flex-1 flex flex-col justify-center">
        <AnswerOptions options={currentQuestion.options} />
      </div>
      <QuizFooter 
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        gamePin={gamePin}
      />
    </div>
  )
}
