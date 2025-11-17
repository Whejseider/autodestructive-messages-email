import crypto from "crypto";
import { StoredMessage } from "@/utils/types";

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = crypto.createHash("sha256").update(password).digest("hex");
  return hashed === hash;
}