import { motion } from 'framer-motion'
import { useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketContext'

interface Player {
  socketId: string
  nickname: string
  score: number
}

export default function StudentLobby() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-8 sm:pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-xl sm:text-2xl text-gray-600 mb-3"
            variants={itemVariants}
          >
            Game PIN
          </motion.h1>
          
          <motion.div 
            className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ type: "spring" }}
          >
            {pin}
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl text-gray-600"
            variants={itemVariants}
          >
            {players.length} {players.length === 1 ? 'player' : 'players'} in lobby
          </motion.p>
        </motion.div>

        {/* Players List */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8 min-h-[300px] border border-gray-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Players</h2>
          
          {players.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg">Waiting for more players...</p>
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
                  className="bg-white rounded-lg p-3 sm:p-4 text-center border border-gray-200 shadow-sm"
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                >
                  <p className="text-gray-800 font-medium truncate text-sm sm:text-base">
                    {player.nickname}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Waiting Message */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-50 rounded-full border border-cyan-200">
            <motion.div
              className="w-2 h-2 bg-cyan-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-cyan-700 font-medium text-sm sm:text-base">
              Waiting for teacher to start...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

