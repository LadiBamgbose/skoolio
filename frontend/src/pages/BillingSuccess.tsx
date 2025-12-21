import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { trackEvent } from '../services/mixpanel'

export default function BillingSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    trackEvent('Billing Success viewed')
    // Optional: Refresh user data to get updated subscription status
    // This could be done via AuthContext.refreshUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to Skoolio Premium!
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your subscription is now active. You can now create unlimited quizzes and access all premium features!
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('/teacher/dashboard')}
          className="w-full py-4 text-white rounded-xl font-medium shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  )
}

