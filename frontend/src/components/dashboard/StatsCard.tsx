import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  percentChange: number
}

export default function StatsCard({ title, value, percentChange }: StatsCardProps) {
  const isPositive = percentChange >= 0

  return (
    <motion.div
      className="relative rounded-2xl p-8 shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(6,182,212,0.2))"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Percentage Change Badge */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}{percentChange}%
      </div>

      {/* Title */}
      <h3 className="text-gray-600 font-medium mb-3">{title}</h3>

      {/* Value */}
      <p className="text-5xl font-bold text-gray-800 mb-6">{value}</p>

      {/* Footer */}
      <p className="text-sm text-gray-500">This month</p>
    </motion.div>
  )
}

