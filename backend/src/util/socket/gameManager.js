// In-memory storage for active game rooms
const gameRooms = new Map();

// Generate a random 6-digit room PIN
function generateRoomPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a new game room
export function createRoom(hostSocketId, quizData) {
  const roomPin = generateRoomPin();
  
  const room = {
    pin: roomPin,
    hostSocketId,
    quizData, // { questions: [...], topic: "..." }
    players: [], // { socketId, nickname, score }
    currentQuestionIndex: 0,
    status: 'waiting', // waiting | active | ended
    answers: [], // Current question's answers
    createdAt: Date.now()
  };
  
  gameRooms.set(roomPin, room);
  console.log(`✅ Room created: ${roomPin}`);
  return room;
}

// Get room by PIN
export function getRoom(roomPin) {
  return gameRooms.get(roomPin);
}

// Add player to room
export function addPlayer(roomPin, socketId, nickname) {
  const room = gameRooms.get(roomPin);
  if (!room) return null;
  
  const player = {
    socketId,
    nickname,
    score: 0,
    joinedAt: Date.now()
  };
  
  room.players.push(player);
  console.log(`👤 ${nickname} joined room ${roomPin}`);
  return player;
}

// Remove player from room
export function removePlayer(socketId) {
  for (const [pin, room] of gameRooms.entries()) {
    const playerIndex = room.players.findIndex(p => p.socketId === socketId);
    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      room.players.splice(playerIndex, 1);
      console.log(`👋 ${player.nickname} left room ${pin}`);
      return { room, player };
    }
  }
  return null;
}

// Delete room
export function deleteRoom(roomPin) {
  const deleted = gameRooms.delete(roomPin);
  if (deleted) {
    console.log(`🗑️  Room deleted: ${roomPin}`);
  }
  return deleted;
}

// Get all active rooms (for debugging)
export function getAllRooms() {
  return Array.from(gameRooms.values());
}

