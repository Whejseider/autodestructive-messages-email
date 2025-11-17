"use client";

import { useState } from "react";

const inputStyles =
  "w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

export default function MessageForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
    const shareableUrl = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/message/${createdId}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500); // Resetea el botón después de 2.5s
    };

    return (
      <div className="w-full max-w-xl space-y-4 text-center">
        <h2 className="text-2xl font-bold">¡Mensaje Creado!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comparte este enlace. Solo podrá verse una vez.
        </p>

        <div className="flex space-x-2">
          <input
            type="text"
            value={shareableUrl}
            readOnly
            className={inputStyles} // Reutilizamos el estilo del input
          />
          <button
            onClick={handleCopy}
            className="rounded bg-gray-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
          >
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block font-semibold mb-1">Título</label>
        <input
          className={inputStyles}
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
          className={inputStyles}
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
          className={inputStyles}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear mensaje"}
      </button>
    </form>
  );
}