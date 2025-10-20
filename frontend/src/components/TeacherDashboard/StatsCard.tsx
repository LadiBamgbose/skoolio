import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: number
}

export default function StatsCard({ title, value }: StatsCardProps) {
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
      {/* Title */}
      <h3 className="text-gray-600 font-medium mb-3">{title}</h3>

      {/* Value */}
      <p className="text-5xl font-bold text-gray-800 mb-6">{value}</p>

      {/* Footer */}
      <p className="text-sm text-gray-500">All time</p>
    </motion.div>
  )
}

