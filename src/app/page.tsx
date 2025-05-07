'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MusicPlayer from '@/components/MusicPlayer';

export default function Home() {
  const [roomId, setRoomId] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setIsInRoom(true);
    setIsHost(true);
    setPlayerId('player1');
  };

  const joinRoom = (roomCode: string) => {
    setRoomId(roomCode);
    setIsInRoom(true);
    setIsHost(false);
    setPlayerId('player2');
  };

  if (!isInRoom) {
    return (
      <main className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Synced Music Player
        </motion.h1>

        <div className="max-w-md mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-purple-400">
              Create or Join a Room
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={createRoom}
                className="w-full p-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
              >
                Create New Room
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  className="w-full p-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  value={roomId}
                />
                <button
                  onClick={() => joinRoom(roomId)}
                  className="w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={!roomId}
                >
                  Join Room
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Synced Music Player
        </h1>
        <div className="text-purple-400">
          Room: {roomId}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MusicPlayer 
            playerId={playerId || 'player1'} 
            roomId={roomId}
            isHost={isHost}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MusicPlayer 
            playerId={playerId === 'player1' ? 'player2' : 'player1'} 
            roomId={roomId}
            isHost={!isHost}
          />
        </motion.div>
      </div>
    </main>
  );
}
