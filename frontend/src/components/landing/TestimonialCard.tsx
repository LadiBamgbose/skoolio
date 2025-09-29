import { motion } from 'framer-motion'

interface TestimonialCardProps {
  quote: string
  name: string
  title: string
  initial: string
  gradientFrom: string
  gradientTo: string
  delay: number
}

export default function TestimonialCard({ 
  quote, 
  name, 
  title, 
  initial, 
  gradientFrom, 
  gradientTo, 
  delay 
}: TestimonialCardProps) {
  return (
    <motion.div 
      className="bg-gradient-to-b from-white to-cyan-50 rounded-2xl p-8 shadow-lg border border-cyan-100 h-100 flex flex-col justify-between"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-gray-700 mb-4 italic">
        "{quote}"
      </p>
      <div className="flex items-center">
        <div 
          className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
        >
          {initial}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}
