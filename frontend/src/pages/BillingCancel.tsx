import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BillingCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cancel Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-full p-4">
            <XCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Payment Cancelled
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No worries! Your payment was cancelled. You can upgrade anytime from your dashboard or the pricing page.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="w-full py-4 text-white rounded-xl font-medium shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)'
            }}
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-cyan-400 hover:text-cyan-600 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

