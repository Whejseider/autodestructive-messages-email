import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/messages.json');

export async function readMessages() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function writeMessages(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}
