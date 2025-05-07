import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

let io: Server;

const ioHandler = (req: Request) => {
  try {
    if (!io) {
      console.log('Initializing Socket.IO server...');
      io = new Server({
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

    return new NextResponse('Socket.IO server is running', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Socket.IO server error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const GET = ioHandler;
export const POST = ioHandler; 