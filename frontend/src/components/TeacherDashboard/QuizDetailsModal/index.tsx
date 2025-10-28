import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuizDetails, useQuizResponses, useToggleQuizStatus } from '@/hooks/useQuiz.hook'
import type { QuizTypes } from '@/types/quiz.types'
import GeneralTab from './GeneralTab'
import QuestionsTab from './QuestionsTab'
import ResponsesTab from './ResponsesTab'

interface QuizDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quiz: QuizTypes.TeacherQuiz | null
}

type TabType = 'general' | 'questions' | 'responses'

export default function QuizDetailsModal({ isOpen, onClose, quiz }: QuizDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [localIsActive, setLocalIsActive] = useState(quiz?.isActive ?? true)
  
  // Fetch detailed data when modal opens
  const { data: quizDetails, isLoading: detailsLoading } = useQuizDetails(quiz?.id || null)
  const { data: responsesData, isLoading: responsesLoading } = useQuizResponses(quiz?.id || null)
  const toggleStatusMutation = useToggleQuizStatus()
  
  // Update local state when quiz prop changes
  useEffect(() => {
    if (quiz?.isActive !== undefined) {
      setLocalIsActive(quiz.isActive)
    }
  }, [quiz?.isActive])
  
  console.log("quiz details is: ", quizDetails)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyShareLink = () => {
    if (!quiz) return
    const fullLink = `https://skoolio.us/quiz/${quiz.shareLink}`
    navigator.clipboard.writeText(fullLink)
  }

  const handleToggleStatus = () => {
    if (quiz?.id) {
      // Optimistically update UI immediately
      setLocalIsActive(!localIsActive)
      toggleStatusMutation.mutate(quiz.id)
    }
  }

  const handleClose = () => {
    console.log('Close button clicked') // Debug log
    setActiveTab('general') // Reset to general tab when closing
    onClose()
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && quiz && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-[85vw] h-[85vh] my-8 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Gradient */}
              <div 
                className="relative rounded-t-2xl p-6 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246)),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")
                  `,
                  backgroundBlendMode: 'overlay'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/30 rounded-full transition-all duration-200 z-[100] cursor-pointer hover:scale-110"
                >
                  <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                </button>

                <div className="relative z-0">
                  <h2 className="text-3xl font-bold text-white">
                    {quiz.topic}
                  </h2>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                      activeTab === 'general'
                        ? 'text-cyan-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    General
                    {activeTab === 'general' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                      activeTab === 'questions'
                        ? 'text-cyan-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Questions
                    {activeTab === 'questions' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('responses')}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                      activeTab === 'responses'
                        ? 'text-cyan-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Responses
                    {activeTab === 'responses' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {activeTab === 'general' && (
                  <GeneralTab 
                    quiz={quiz}
                    localIsActive={localIsActive}
                    handleToggleStatus={handleToggleStatus}
                    toggleStatusPending={toggleStatusMutation.isPending}
                    copyShareLink={copyShareLink}
                    formatDate={formatDate}
                  />
                )}

                {activeTab === 'questions' && (
                  <QuestionsTab 
                    quizDetails={quizDetails}
                    isLoading={detailsLoading}
                  />
                )}

                {activeTab === 'responses' && (
                  <ResponsesTab 
                    responsesData={responsesData}
                    isLoading={responsesLoading}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

