import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const plans = [
  {
    title: 'Teacher',
    price: '$7.99',
    period: 'month',
    popular: true,
    features: [
      '60 quizzes per month',
      'Choose 10-30 questions',
      'Grade-specific content',
      'Priority support',
      'Quiz analytics'
    ]
  },
  {
    title: 'Advanced',
    price: '$12.99',
    period: 'month',
    popular: false,
    features: [
      'Unlimited quizzes',
      'Unlimited questions',
      'Team collaboration',
      'Custom branding',
      'API access',
      'Dedicated support'
    ]
  }
]

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
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
              className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                >
                  Upgrade Your Plan
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-lg"
                >
                  Choose the perfect plan for your classroom needs
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-sm text-gray-500"
                >
                  Current plan: <span className="font-semibold text-gray-700">Basic (5 quizzes/month)</span>
                </motion.p>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`relative rounded-2xl p-6 border-2 flex flex-col ${
                      plan.popular
                        ? 'bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 border-cyan-400 shadow-xl'
                        : 'bg-white border-gray-200 shadow-lg'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-md bg-gradient-to-r from-cyan-500 to-blue-600">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-2 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent' 
                        : 'text-gray-900'
                    }`}>
                      {plan.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
                            : 'text-gray-900'
                        }`}>
                          {plan.price}
                        </span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6 flex-grow">
                      {plan.features.map((feature, fIndex) => (
                        <motion.li
                          key={fIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + fIndex * 0.05 }}
                          className="flex items-start gap-2"
                        >
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-cyan-600' : 'text-gray-600'
                          }`} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        plan.popular
                          ? 'text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:text-cyan-600'
                      }`}
                      style={plan.popular ? {
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)'
                      } : undefined}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Upgrade to {plan.title}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
                >
                  Maybe Later
                </button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

