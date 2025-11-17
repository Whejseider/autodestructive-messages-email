// types.ts

export interface StoredMessage {
  id: string;
  title: string;
  content: string;
  passwordHash?: string; // sha256 hash if provided
}

export interface MessageRepository {
  readAll(): Promise<Record<string, StoredMessage>>;
  writeAll(messages: Record<string, StoredMessage>): Promise<void>;
}

export interface CreateMessageInput {
  title: string;
  content: string;
  password?: string; // plain password — will be hashed by the service
}

export interface CreateMessageResult {
  id: string;
}

export interface FetchMessageResult {
  id: string;
  title: string;
  content: string;
}
