import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { TELEGRAM_BOT_TOKEN } = process.env;

  if (!TELEGRAM_BOT_TOKEN) {
    return new NextResponse('TELEGRAM_BOT_TOKEN environment variable not found', { status: 500 });
  }

  // Your bot logic here
  // For example, sending a message to Telegram
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: 'your_chat_id',
      text: 'Hello from Next.js!',
    }),
  });

  if (!response.ok) {
    return new NextResponse('Failed to send message to Telegram', { status: 500 });
  }

  return new NextResponse('Message sent successfully', { status: 200 });
}