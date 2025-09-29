import { motion } from 'framer-motion'

interface AnswerOptionsProps {
  options: string[];
  onSelect?: (option: string) => void;
}

export default function AnswerOptions({ options, onSelect }: AnswerOptionsProps) {
  const gradients = [
    'linear-gradient(135deg, #ff6b6b, #ee5a52, #c44569)', // Red - Modern coral to deep red
    'linear-gradient(135deg, #74b9ff, #0984e3, #6c5ce7)', // Blue - Ocean blue to purple
    'linear-gradient(135deg, #fdcb6e, #e17055, #f39c12)', // Yellow - Golden to warm orange
    'linear-gradient(135deg, #00b894, #00cec9, #55a3ff)'  // Green - Mint to cyan to blue
  ]
  console.log(options)

  return (
    <motion.div 
      className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4 px-4 md:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          className="h-32 md:h-40 w-full rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg gap-2 md:gap-4"
          style={{ background: gradients[index] }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect?.(option)}
        >
          {/* Shape Icons */}
          <div className="w-8 h-8">
            {index === 0 && (
              <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-white" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}></div>
            )}
            {index === 1 && (
              <div className="w-8 h-8 bg-white transform rotate-45" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}></div>
            )}
            {index === 2 && (
              <div className="w-8 h-8 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, white, #f0f0f0)', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}></div>
            )}
            {index === 3 && (
              <div className="w-8 h-8 bg-white transform rotateX(45deg) rotateY(15deg)" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}></div>
            )}
          </div>
{option.replace(/^[A-D]\)\s*/, '')}
        </motion.button>
      ))}
    </motion.div>
  )
}
