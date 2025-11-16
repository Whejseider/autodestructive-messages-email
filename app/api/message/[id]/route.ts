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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const messages = await readMessages();
  const message = messages[params.id];

  if (!message) {
    return new NextResponse('Message not found', { status: 404 });
  }

  if (message.password) {
    return NextResponse.json({ password: true });
  }

  delete messages[params.id];
  await writeMessages(messages);

  return NextResponse.json(message);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { password } = await req.json();
  const messages = await readMessages();
  const message = messages[params.id];

  if (!message) {
    return new NextResponse('Message not found', { status: 404 });
  }

  if (message.password !== password) {
    return new NextResponse('Incorrect password', { status: 401 });
  }

  delete messages[params.id];
  await writeMessages(messages);

  return NextResponse.json(message);
}
