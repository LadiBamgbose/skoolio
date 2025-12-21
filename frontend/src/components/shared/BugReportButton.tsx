import { motion } from 'framer-motion'
import skoolioLogo from '../../assets/Skoolio.png'

interface BugReportButtonProps {
  onClick?: () => void
}

export default function BugReportButton({ onClick }: BugReportButtonProps) {
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <img
        src={skoolioLogo}
        alt="Report Bug"
        className="h-12 w-auto object-contain drop-shadow-lg"
      />
    </motion.button>
  )
}

