import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'
import { LogIn } from 'lucide-react'

export default function StudentJoin() {
  const [pin, setPin] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    // Listen for successful join
    socket.on('joined_room', (data) => {
      console.log('Joined room:', data.pin)
      navigate(`/student/lobby/${data.pin}`, {
        state: { nickname: data.player.nickname }
      })
    })

    // Listen for errors
    socket.on('error', (data) => {
      setError(data.message)
    })

    return () => {
      socket.off('joined_room')
      socket.off('error')
    }
  }, [socket, navigate])

  const handleJoin = () => {
    // Validate inputs
    if (!pin.trim() || pin.length !== 6) {
      setError('Please enter a valid 6-digit PIN')
      return
    }
    
    if (!nickname.trim()) {
      setError('Please enter a nickname')
      return
    }

    setError('')
    
    if (!socket) {
      setError('Connection error. Please refresh.')
      return
    }

    // Emit join_room event
    socket.emit('join_room', {
      pin: pin.trim(),
      nickname: nickname.trim()
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.h1
            className="text-5xl sm:text-4xl font-bold text-center bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
            variants={itemVariants}
          >
            Join Game
          </motion.h1>
          
          <motion.p
            className="text-center text-gray-600 mb-10 text-base sm:text-base"
            variants={itemVariants}
          >
            Enter the game PIN and your nickname
          </motion.p>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-base"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* PIN Input */}
          <motion.div className="mb-8" variants={itemVariants}>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Game PIN
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-5 text-3xl sm:text-2xl text-center font-bold border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none tracking-widest"
            />
          </motion.div>

          {/* Nickname Input */}
          <motion.div className="mb-10" variants={itemVariants}>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Your Nickname
            </label>
            <input
              type="text"
              maxLength={20}
              placeholder="Enter your name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              className="w-full px-4 py-5 text-lg border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
            />
          </motion.div>

          {/* Join Button */}
          <motion.button
            className="w-full py-5 text-white rounded-xl font-semibold shadow-lg flex items-center gap-3 justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={!pin || !nickname}
          >
            <LogIn className="w-6 h-6" />
            Join Game
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

