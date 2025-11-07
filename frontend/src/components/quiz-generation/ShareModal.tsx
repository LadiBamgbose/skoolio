import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareLink: string
}

export default function ShareModal({ isOpen, onClose, shareLink }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()
  const quizUrl = `skoolio.app/quiz/${shareLink}`

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${quizUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Copy className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Share Your Quiz
                </h2>
                <p className="text-gray-600 mb-8">
                  Students can use this link to access the quiz
                </p>

                {/* Quiz Link Display */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-gray-600 font-medium mb-2">Quiz Link</p>
                  <div className="bg-white/80 rounded-xl p-4 border border-cyan-100">
                    <p className="text-cyan-700 font-mono text-sm break-all">
                      {quizUrl}
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>

                {/* Dashboard Message for Logged-in Users */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          Quiz Saved!
                        </p>
                        <p className="text-xs text-gray-600">
                          You can view and manage all your quizzes in your Dashboard
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Students can visit this link to take the quiz
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

