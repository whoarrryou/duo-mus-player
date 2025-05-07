'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/solid';

interface MusicPlayerProps {
  playerId: string;
  roomId: string;
  isHost: boolean;
}

interface Song {
  id: string;
  title: string;
  url: string;
}

export default function MusicPlayer({ playerId, roomId, isHost }: MusicPlayerProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaylistLooping, setIsPlaylistLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [otherPlayerState, setOtherPlayerState] = useState({
    currentSong: '',
    isPlaying: false,
    progress: 0
  });
  
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // Initialize socket connection with the correct URL
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:3000';
    
    const connectSocket = () => {
      socketRef.current = io(socketUrl, {
        path: '/api/socket',
        addTrailingSlash: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        // Join room after successful connection
        socketRef.current?.emit('joinRoom', { roomId, playerId });
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
      });

      // Only listen to other player's state updates
      socketRef.current.on('playerState', (data) => {
        if (data.playerId !== playerId && data.roomId === roomId) {
          setOtherPlayerState({
            currentSong: data.currentSong,
            isPlaying: data.isPlaying,
            progress: data.progress
          });
        }
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [playerId, roomId]);

  useEffect(() => {
    // Load songs from the current player's directory only
    const loadSongs = async () => {
      try {
        const response = await fetch(`/api/songs?player=${playerId}`);
        const data = await response.json();
        setSongs(data.songs);
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, [playerId]);

  useEffect(() => {
    if (songs.length > 0) {
      loadSong(currentSongIndex);
    }
  }, [songs, currentSongIndex]);

  const loadSong = (index: number) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const song = songs[index];
    if (!song) return;

    soundRef.current = new Howl({
      src: [song.url],
      html5: true,
      preload: true,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
      },
      onend: () => {
        if (isLooping) {
          soundRef.current?.play();
        } else if (isPlaylistLooping) {
          handleNext();
        } else if (currentSongIndex < songs.length - 1) {
          handleNext();
        }
      },
    });
  };

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      clearInterval(progressIntervalRef.current);
    } else {
      soundRef.current.play();
      progressIntervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const currentTime = soundRef.current.seek() as number;
          setProgress((currentTime / duration) * 100);
        }
      }, 100);
    }

    setIsPlaying(!isPlaying);

    // Broadcast state to other player
    socketRef.current?.emit('playerState', {
      roomId,
      playerId,
      currentSong: songs[currentSongIndex]?.title || '',
      isPlaying: !isPlaying,
      progress
    });
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    
    // Broadcast state to other player
    socketRef.current?.emit('playerState', {
      roomId,
      playerId,
      currentSong: songs[nextIndex]?.title || '',
      isPlaying: false,
      progress: 0
    });
  };

  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(false);
    
    // Broadcast state to other player
    socketRef.current?.emit('playerState', {
      roomId,
      playerId,
      currentSong: songs[prevIndex]?.title || '',
      isPlaying: false,
      progress: 0
    });
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    setIsPlaylistLooping(false);
  };

  const togglePlaylistLoop = () => {
    setIsPlaylistLooping(!isPlaylistLooping);
    setIsLooping(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-purple-400">
        {isHost ? 'Your Player' : 'Friend\'s Player'}
      </h2>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-medium">
            {songs[currentSongIndex]?.title || 'No song selected'}
          </p>
        </div>

        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevious}
            className="p-2 hover:text-purple-400 transition-colors"
          >
            <BackwardIcon className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 hover:text-purple-400 transition-colors"
          >
            <ForwardIcon className="w-6 h-6" />
          </button>

          <button
            onClick={toggleLoop}
            className={`p-2 transition-colors ${
              isLooping ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
            }`}
            title="Loop current song"
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlaylistLoop}
            className={`p-2 transition-colors ${
              isPlaylistLooping ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
            }`}
            title="Loop playlist"
          >
            <ArrowPathRoundedSquareIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Other player's status */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            {otherPlayerState.currentSong ? (
              <>
                Friend is {otherPlayerState.isPlaying ? 'playing' : 'paused'}: {otherPlayerState.currentSong}
                <br />
                Progress: {Math.round(otherPlayerState.progress)}%
              </>
            ) : (
              'Friend hasn\'t started playing yet'
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 