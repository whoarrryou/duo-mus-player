import { NextResponse } from 'next/server';
import { getIO } from '@/lib/socket';

export async function GET() {
  try {
    const io = getIO();
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
}

export async function POST() {
  return GET();
} 