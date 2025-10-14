import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface PricingCardProps {
  title: string
  price: string
  period?: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
  onSelect?: () => void
}

export default function PricingCard({
  title,
  price,
  period = 'month',
  features,
  isPopular = false,
  buttonText = 'Get Started',
  onSelect
}: PricingCardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl p-10 h-full flex flex-col w-full ${
        isPopular
          ? 'bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 border-2 border-cyan-400 shadow-xl'
          : 'bg-white border-2 border-gray-200 shadow-lg'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-sm font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-cyan-500 to-blue-600">
            Most Popular
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className={`text-2xl font-bold mb-2 ${
        isPopular 
          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent' 
          : 'text-gray-900'
      }`}>
        {title}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-bold ${
            isPopular 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            {price}
          </span>
          {price !== 'Free' && (
            <span className="text-gray-500 text-lg">/{period}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isPopular ? 'text-cyan-600' : 'text-gray-600'
            }`} />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={onSelect}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
          isPopular
            ? 'text-white shadow-lg'
            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:text-cyan-600'
        }`}
        style={isPopular ? {
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)'
        } : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  )
}

