import { messageRepository } from "@/repository/repository";
import PasswordForm from "./PasswordForm";

export default async function MessageView({ id }: { id: string }) {
  const msg = await messageRepository.getById(id);

  if (!msg) {
    return (
      <p className="text-center text-red-600">
        Estás buscando algún mensaje? Puede que ya no lo encuentres nunca más.
      </p>
    );
  }

  // If it has password → ask for password
  if (msg.passwordHash) {
    return (
      <div className="max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Mensaje protegido</h1>
        <p>Este mensaje requiere una contraseña para verse.</p>

        {/* Client Component */}
        <PasswordForm id={id} />
      </div>
    );
  }

  // If message has no password → auto-read + destroy
  await messageRepository.deleteById(id);

  return (
    <div className="border p-4 rounded max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{msg.title}</h1>
      <p>{msg.content}</p>
      <p className="mt-4 text-sm text-gray-600">⚠️ Este mensaje ya fue destruido.</p>
    </div>
  );
}
