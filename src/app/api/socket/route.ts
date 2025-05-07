import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

const ioHandler = (req: Request) => {
  if (!global.io) {
    console.log('Initializing Socket.IO server...');
    const io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
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

    global.io = io;
  }

  return new NextResponse('Socket.IO server is running');
};

export const GET = ioHandler;
export const POST = ioHandler; 