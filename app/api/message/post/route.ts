import {NextResponse} from "next/server";
import {messageRepository} from "@/repository/repository";
import {hashPassword} from "@/utils/hash";
import {randomUUID} from "crypto";

export async function POST(req: Request) {
  try {
    const { title, content, password } = await req.json();

    const id = randomUUID();

    const passwordHash = password
      ? await hashPassword(password)
      : undefined;

    await messageRepository.save({
      id,
      title,
      content,
      passwordHash,
    });

    return NextResponse.json({ id });
  } catch (err) {
    return new NextResponse("internal-error", { status: 500 });
  }
}
