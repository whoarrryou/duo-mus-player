import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const player = searchParams.get('player');

  if (!player || !['player1', 'player2'].includes(player)) {
    return NextResponse.json({ error: 'Invalid player parameter' }, { status: 400 });
  }

  try {
    const musicDir = path.join(process.cwd(), 'public', 'music', player);
    const files = fs.readdirSync(musicDir);

    const songs = files
      .filter(file => /\.(mp3|wav|ogg|m4a)$/i.test(file))
      .map(file => ({
        id: file,
        title: file.replace(/\.[^/.]+$/, ''),
        url: `/music/${player}/${file}`
      }));

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error reading music directory:', error);
    return NextResponse.json({ error: 'Failed to load songs' }, { status: 500 });
  }
} 