import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export function getIO() {
  if (!io) {
    io = new SocketIOServer({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      path: '/api/socket',
      addTrailingSlash: false
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('joinRoom', ({ roomId, playerId }) => {
        // Leave any existing rooms
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Join the new room
        socket.join(roomId);
        console.log(`Player ${playerId} joined room ${roomId}`);
      });

      socket.on('playerState', (data) => {
        // Broadcast player state to other players in the room
        socket.to(data.roomId).emit('playerState', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  return io;
} 