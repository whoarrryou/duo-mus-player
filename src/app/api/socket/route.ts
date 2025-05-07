import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('play', (data) => {
        socket.broadcast.emit('play', data);
      });

      socket.on('pause', (data) => {
        socket.broadcast.emit('pause', data);
      });

      socket.on('seek', (data) => {
        socket.broadcast.emit('seek', data);
      });

      socket.on('changeSong', (data) => {
        socket.broadcast.emit('changeSong', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler; 