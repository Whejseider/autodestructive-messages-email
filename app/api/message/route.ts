import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');

async function readMessages() {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function writeMessages(messages: any) {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
}

export async function POST(req: NextRequest) {
  const { message, password, sender, title } = await req.json();
  const messages = await readMessages();
  const id = Math.random().toString(36).substring(2, 15);

  messages[id] = {
    message,
    password,
    sender,
    title,
  };

  await writeMessages(messages);

  const link = `${req.nextUrl.origin}/message/${id}`;

  return NextResponse.json({ link });
}
