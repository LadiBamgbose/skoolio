import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { Play } from 'lucide-react'

interface Player {
  socketId: string
  nickname: string
  score: number
}

export default function TeacherLobby() {
  const { pin } = useParams<{ pin: string }>()
  const { socket } = useSocket()
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (!socket) return

    // Listen for players joining
    socket.on('player_joined', (data) => {
      setPlayers(data.players)
    })

    // Listen for players leaving
    socket.on('player_left', (data) => {
      setPlayers(data.players)
    })

    return () => {
      socket.off('player_joined')
      socket.off('player_left')
    }
  }, [socket])

  const handleBeginQuiz = () => {
    // TODO: Emit start_quiz event
    console.log('Begin quiz clicked')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-2xl text-gray-600 mb-4"
            variants={itemVariants}
          >
            Game PIN
          </motion.h1>
          
          <motion.div 
            className="text-8xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8"
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ type: "spring" }}
          >
            {pin}
          </motion.div>

          <motion.p
            className="text-xl text-gray-600"
            variants={itemVariants}
          >
            {players.length} {players.length === 1 ? 'player' : 'players'} joined
          </motion.p>
        </motion.div>

        {/* Players List */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 mb-8 min-h-[300px] border border-gray-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Players</h2>
          
          {players.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Waiting for players to join...</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {players.map((player) => (
                <motion.div
                  key={player.socketId}
                  className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm"
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                >
                  <p className="text-gray-800 font-medium truncate">{player.nickname}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Begin Quiz Button */}
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            className="px-12 py-4 text-white rounded-xl font-medium shadow-lg flex items-center gap-3 justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
            }}
            whileHover={{ 
              scale: players.length > 0 ? 1.05 : 1,
            }}
            whileTap={{ scale: players.length > 0 ? 0.95 : 1 }}
            onClick={handleBeginQuiz}
            disabled={players.length === 0}
          >
            <Play className="w-6 h-6" />
            Begin Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

