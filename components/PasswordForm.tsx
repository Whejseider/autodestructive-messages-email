"use client";

import { useState } from "react";

export default function PasswordForm({ id }: { id: string }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(false);

    async function verify() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/message/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
            if (res.status === 401) {
                setError("Contraseña incorrecta.");
                setLoading(false);
                return;
            }
            if (res.status === 404) {//innecesario
                setError("El mensaje no se encontró.");
                setLoading(false);
                return;
            }
            /*if (!res.ok) {
                setError("Error inesperado.");
                setLoading(false);
                return;
            }
            */
            const data = await res.json();
            setMessage(data);
        } catch {
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    }

    if (message) {
        return (
            <div className="border p-4 rounded max-w-xl mx-auto">
                <h1 className="text-xl font-bold mb-2">{message.title}</h1>
                <p>{message.content}</p>
                <p className="mt-4 text-sm text-gray-600">⚠️ Este mensaje ya fue destruido.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <input
                type="password"
                className="border px-2 py-1 rounded w-full"
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
                onClick={verify}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded w-full"
            >
                {loading ? "Verificando..." : "Ver mensaje"}
            </button>
        </div>
    );
}
