# Synced Music Player

A synchronized music player web application that allows two people to play music together in real-time. The application features two side-by-side music players that stay in sync, allowing both users to control playback, change songs, and see the current progress.

## Features

- Two synchronized music players
- Real-time playback control
- Progress synchronization
- Song selection synchronization
- Loop functionality
- Beautiful, modern UI with animations
- Support for various audio formats (MP3, WAV, OGG, M4A)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd casette-player
```

2. Install dependencies:
```bash
npm install
```

3. Add your music files:
   - Place your music files in the `public/music/player1` directory for Player 1
   - Place your music files in the `public/music/player2` directory for Player 2
   - Supported formats: MP3, WAV, OGG, M4A

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Open the same URL in another browser window or device to test the synchronization.

## Usage

1. Each player can control their own music player independently
2. When one player starts playing, pauses, or changes songs, the other player's music player will sync automatically
3. Use the loop button to enable/disable looping for the current song
4. The progress bar shows the current position in the song
5. Use the previous/next buttons to change songs

## Deployment

The application is ready to be deployed to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy

## Technologies Used

- Next.js 14
- TypeScript
- Socket.IO
- Howler.js
- Tailwind CSS
- Framer Motion
- Heroicons

## License

This project is licensed under the MIT License.
