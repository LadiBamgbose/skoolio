import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowUp } from 'lucide-react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useQuizCreation } from '../../contexts/QuizCreationContext'
import { useAuth } from '../../contexts/AuthContext'

const gradeLevels = [
  { id: 'k', name: 'K' },
  { id: '1', name: '1st Grade' },
  { id: '2', name: '2nd Grade' },
  { id: '3', name: '3rd Grade' },
  { id: '4', name: '4th Grade' },
  { id: '5', name: '5th Grade' },
  { id: '6', name: '6th Grade' },
  { id: '7', name: '7th Grade' },
  { id: '8', name: '8th Grade' },
  { id: '9', name: '9th Grade' },
  { id: '10', name: '10th Grade' },
  { id: '11', name: '11th Grade' },
  { id: '12', name: '12th Grade' },
]

const questionCounts = [
  { id: 10, name: '10 Questions' },
  { id: 15, name: '15 Questions' },
  { id: 20, name: '20 Questions' },
  { id: 25, name: '25 Questions' },
  { id: 30, name: '30 Questions' },
]

const MIN_WIDTH = 300
const MAX_WIDTH = 600

interface QuizCreationSidebarProps {
  width: number
  setWidth: (width: number) => void
  onUpgradeClick: () => void
}

export default function QuizCreationSidebar({ width, setWidth, onUpgradeClick }: QuizCreationSidebarProps) {
  const [topic, setTopic] = useState('')
  const [gradeLevel, setGradeLevel] = useState(gradeLevels[5])
  const [questionCount, setQuestionCount] = useState(questionCounts[0])
  const [error, setError] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { generateQuiz, status } = useQuizCreation()
  const { user } = useAuth()

  const isBasicPlan = user?.plan === 'BASIC'
  const isGenerateDisabled = !topic.trim() || status === 'loading' || status === 'success'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0)
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleGenerateQuiz = () => {
    setError('')

    if (!topic.trim()) {
      setError('Please enter a topic or lesson text')
      return
    }

    if (topic.trim().length > 500) {
      setError('Topic must be less than 500 characters')
      return
    }

    generateQuiz(topic.trim(), gradeLevel.name, questionCount.id)
  }

  return (
    <div 
      ref={sidebarRef}
      className="fixed left-[16rem] top-0 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-cyan-400 transition-colors z-20"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Sidebar Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Quiz</h2>
        <p className="text-sm text-gray-500 mb-6">Generate a quiz for your students</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Topic Input */}
        <div className="mb-4 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic or Lesson Text
          </label>
          <textarea
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter a topic or paste your lesson text…"
            className="w-full h-32 px-4 py-3 text-sm border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none resize-none transition-colors"
          />
          <div className="mt-1 text-right">
            <span className={`text-xs ${topic.length > 500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
              {topic.length}/500
            </span>
          </div>
        </div>

        {/* Grade Level Dropdown */}
        <div className="mb-4 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level
          </label>
          <Listbox value={gradeLevel} onChange={setGradeLevel}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer rounded-lg py-3 pl-4 pr-10 text-left border-2 border-gray-200 focus:border-cyan-400 focus:outline-none transition-colors">
                <span className="block truncate text-gray-800 font-medium">
                  {gradeLevel.name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg border border-gray-200 focus:outline-none z-10">
                {gradeLevels.map((level) => (
                  <ListboxOption
                    key={level.id}
                    className="relative cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-cyan-50 text-gray-900"
                    value={level}
                  >
                    <span className="block truncate font-medium">
                      {level.name}
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        {/* Question Count Dropdown */}
        <div className="mb-6 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          {isBasicPlan ? (
            // For BASIC users - clickable div that shows upgrade modal
            <div 
              onClick={onUpgradeClick}
              className="relative w-full cursor-pointer rounded-lg py-3 pl-4 pr-10 text-left border-2 border-gray-200 hover:border-cyan-400 transition-colors"
            >
              <span className="block truncate text-gray-800 font-medium">
                {questionCount.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </span>
            </div>
          ) : (
            // For TEACHER/ADVANCED users - normal dropdown
            <Listbox value={questionCount} onChange={setQuestionCount}>
              <div className="relative">
                <ListboxButton className="relative w-full cursor-pointer rounded-lg py-3 pl-4 pr-10 text-left border-2 border-gray-200 focus:border-cyan-400 focus:outline-none transition-colors">
                  <span className="block truncate text-gray-800 font-medium">
                    {questionCount.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg border border-gray-200 focus:outline-none z-10">
                  {questionCounts.map((count) => (
                    <ListboxOption
                      key={count.id}
                      className="relative cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-cyan-50 text-gray-900"
                      value={count}
                    >
                      <span className="block truncate font-medium">
                        {count.name}
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          )}
        </div>

        {/* Generate Button */}
        <div className="mt-auto flex-shrink-0">
          <motion.button
            onClick={handleGenerateQuiz}
            disabled={isGenerateDisabled}
            className="relative w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246)),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")
              `,
              backgroundBlendMode: 'overlay'
            }}
            whileHover={!isGenerateDisabled ? { 
              scale: 1.02,
            } : {}}
            whileTap={!isGenerateDisabled ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Generate Quiz</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

