import { motion } from 'framer-motion'
import { Check, X, Star } from 'lucide-react'

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  period: string;
  credits: string;
  creditsSubtext: string;
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
  popular: boolean;
  features: Feature[];
  delay: number;
}

export default function PricingCard({
  name,
  description,
  price,
  period,
  credits,
  creditsSubtext,
  buttonText,
  buttonStyle,
  popular,
  features,
  delay
}: PricingCardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl p-10 shadow-lg min-h-[600px] flex flex-col ${
        popular 
          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-0.5' 
          : 'bg-gradient-to-r from-gray-200 via-cyan-200 to-gray-200 p-px'
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={popular ? {
        background: [
          'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
          'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)', 
          'linear-gradient(135deg, #8b5cf6, #06b6d4, #3b82f6)',
          'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)'
        ]
      } : {}}
      transition={popular ? {
        background: { duration: 3, repeat: Infinity, ease: "linear" },
        opacity: { duration: 0.6, delay },
        y: { duration: 0.6, delay }
      } : { duration: 0.6, delay }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Star className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className={`flex flex-col min-h-[600px] ${popular ? '' : 'bg-white rounded-2xl p-10'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className={`text-2xl font-bold mb-2 ${popular ? 'text-white' : 'text-gray-800'}`}>{name}</h3>
          <p className={`mb-4 ${popular ? 'text-white/90' : 'text-gray-600'}`}>{description}</p>
          
          <div className="mb-4">
            <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-gray-800'}`}>${price}</span>
            <span className={popular ? 'text-white/80' : 'text-gray-600'}>/{period}</span>
          </div>
          
          <div className={`rounded-lg p-3 ${popular ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-50'}`}>
            <p className={`font-medium ${popular ? 'text-white' : 'text-gray-800'}`}>{credits}</p>
            <p className={`text-sm ${popular ? 'text-white/80' : 'text-gray-600'}`}>{creditsSubtext}</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex-grow mb-8">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
              <span className={`text-sm ${
                feature.included 
                  ? (popular ? 'text-white' : 'text-gray-700')
                  : (popular ? 'text-white/50' : 'text-gray-400')
              }`}>
                {feature.text}
              </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <motion.button
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
            buttonStyle === 'primary'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}
