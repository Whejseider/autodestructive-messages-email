import {messageRepository} from "@/repository/repository";
import {StoredMessage} from "@/utils/types";
import {hashPassword, verifyPassword} from "@/utils/hash";
import {v4 as uuid} from "uuid";

export const messageService = {
  async createMessage(
    title: string,
    content: string,
    password?: string
  ): Promise<StoredMessage> {

    const passwordHash = password
      ? await hashPassword(password)
      : undefined;

    const newMessage: StoredMessage = {
      id: uuid(),
      title,
      content,
      passwordHash,
    };

    await messageRepository.save(newMessage);
    return newMessage;
  },

  async readMessage(id: string, password?: string) {
    const msg = await messageRepository.getById(id);

    if (!msg) {
      return { status: "not-found" } as const;
    }

    // no password required
    if (!msg.passwordHash) {
      await messageRepository.deleteById(id);
      return {
        status: "success",
        title: msg.title,
        content: msg.content,
      } as const;
    }

    // requires password but none provided
    if (!password) {
      return { status: "requires-password" } as const;
    }

    // wrong password
    const ok = await verifyPassword(password, msg.passwordHash);
    if (!ok) {
      return { status: "wrong-password" } as const;
    }

    // correct password → auto delete
    await messageRepository.deleteById(id);
    return {
      status: "success",
      title: msg.title,
      content: msg.content,
    } as const;
  },
};
