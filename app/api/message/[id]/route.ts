import {NextResponse} from "next/server";
import {messageService} from "@/services/message.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { password } = await req.json().catch(() => ({}));
  const result = await messageService.readMessage(id, password);
  
  switch (result.status) {
    case "not-found":
      return new NextResponse("not-found", { status: 404 });
    case "requires-password":
      return new NextResponse("requires-password", { status: 401 });
    case "wrong-password":
      return new NextResponse("wrong-password", { status: 401 });
    case "success":
      return NextResponse.json({
        title: result.title,
        content: result.content,
      });
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await messageService.readMessage(id);
  
  switch (result.status) {
    case "not-found":
      return new NextResponse("not-found", { status: 404 });
    case "requires-password":
      return new NextResponse("requires-password", { status: 401 });
    case "success":
      return NextResponse.json({
        title: result.title,
        content: result.content,
      });
  }
}