import * as GameManager from './gameManager.js';
import GameSessionLogic from '../../prismaLogic/GameSession.js';

export function setupSocketHandlers(io, socket) {
  console.log('User connected:', socket.id);

  // Teacher creates a game room
  socket.on('create_room', async (data) => {
    try {
      const { quizData, quizId } = data;
      
      // Create in-memory room
      const room = GameManager.createRoom(socket.id, quizData);
      
      // Save to database
      await GameSessionLogic.createGameSession(room.pin, quizId, 'waiting');
      
      // Join socket room
      socket.join(room.pin);
      
      // Send PIN back to teacher
      socket.emit('room_created', { 
        pin: room.pin,
        room: {
          pin: room.pin,
          status: room.status,
          players: room.players
        }
      });
      
      console.log(`✅ Room ${room.pin} created by ${socket.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  // Student joins a room
  socket.on('join_room', async (data) => {
    try {
      const { pin, nickname } = data;
      
      // Add player to in-memory room
      const player = GameManager.addPlayer(pin, socket.id, nickname);
      
      if (!player) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Join socket room
      socket.join(pin);
      
      // Notify student they joined
      socket.emit('joined_room', { pin, player });
      
      // Get updated room
      const room = GameManager.getRoom(pin);
      
      // Broadcast to everyone in room (including teacher)
      io.to(pin).emit('player_joined', {
        player,
        players: room.players,
        totalPlayers: room.players.length
      });
      
      console.log(`✅ ${nickname} joined room ${pin}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from room if they were in one
    const result = GameManager.removePlayer(socket.id);
    
    if (result) {
      const { room, player } = result;
      // Notify others in the room
      io.to(room.pin).emit('player_left', {
        player,
        players: room.players,
        totalPlayers: room.players.length
      });
    }
  });
}

