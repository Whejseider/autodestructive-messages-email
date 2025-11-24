import {promises as fs} from "fs";
import path from "path";
import {StoredMessage} from "@/utils/types";

const filePath = path.join(process.cwd(), "data/messages.json");

function ensureDict(data: any): Record<string, StoredMessage> {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data;
  }
  return {}; // reset if corrupted
}

export const messageRepository = {
  async getAll(): Promise<Record<string, StoredMessage>> {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);
      return ensureDict(parsed);
    } catch (err: any) {
      if (err.code === "ENOENT") return {};
      throw err;
    }
  },

  async saveAll(messages: Record<string, StoredMessage>): Promise<void> {
    await fs.writeFile(
      filePath,
      JSON.stringify(messages, null, 2),
      "utf-8"
    );
  },

  async getById(id: string): Promise<StoredMessage | undefined> {
    const messages = await this.getAll();
    return messages[id];
  },

  async deleteById(id: string): Promise<void> {
    const messages = await this.getAll();
    delete messages[id];
    await this.saveAll(messages);
  },

  async save(message: StoredMessage): Promise<void> {
    const messages = await this.getAll();
    messages[message.id] = message;
    await this.saveAll(messages);
  },
};
