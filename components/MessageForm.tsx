"use client";

import { useState } from "react";

export default function MessageForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }

    if (!content.trim() || content.length > 256) {
      setError("El mensaje debe tener entre 1 y 256 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/message/post", {
        method: "POST",
        body: JSON.stringify({ title, content, password }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setCreatedId(data.id);
    } catch (err: any) {
      setError(err.message || "Error creando el mensaje");
    } finally {
      setLoading(false);
    }
  }

  if (createdId) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Mensaje creado</h2>
        <p>
          Comparte este enlace (solo podrá verse una vez):
        </p>
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {`${typeof window !== "undefined" ? window.location.origin : ""}/message/${createdId}`}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block font-semibold mb-1">Título</label>
        <input
          className="border px-2 py-1 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Mensaje (máx. 256 caracteres)
        </label>
        <textarea
          className="border px-2 py-1 w-full rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={256}
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Contraseña (opcional)</label>
        <input
          type="password"
          className="border px-2 py-1 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear mensaje"}
      </button>
    </form>
  );
}
