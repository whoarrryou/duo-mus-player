const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active rooms and their players
  const rooms = new Map();

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
      
      // Store player in room
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(playerId);

      console.log(`Player ${playerId} joined room ${roomId}`);
    });

    socket.on('playerState', (data) => {
      // Broadcast player state to other players in the room
      socket.to(data.roomId).emit('playerState', data);
    });

    socket.on('disconnect', () => {
      // Clean up rooms when players disconnect
      rooms.forEach((players, roomId) => {
        if (players.size === 0) {
          rooms.delete(roomId);
        }
      });
      console.log('Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 