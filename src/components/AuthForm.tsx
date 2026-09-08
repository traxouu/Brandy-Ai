"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };
    if (isRegister) payload.name = String(data.get("name") ?? "");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Une erreur est survenue.");
        setPending(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Impossible de joindre le serveur.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {isRegister && (
        <div>
          <label className="label" htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            name="name"
            className="field"
            placeholder="Camille Dupont"
            autoComplete="name"
            required
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="field"
          placeholder="vous@studio.fr"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          placeholder="8 caractères minimum"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-[var(--color-violet)]/30 bg-[var(--color-violet-voile)] px-4 py-3 text-sm text-[var(--color-violet-fonce)]">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full py-3" disabled={pending}>
        {pending
          ? "Un instant…"
          : isRegister
            ? "Créer mon compte"
            : "Me connecter"}
      </button>

      <p className="text-center text-sm text-[var(--color-encre-tenue)]">
        {isRegister ? (
          <>
            Déjà un compte ?{" "}
            <Link href="/login" className="font-bold text-[var(--color-violet)]">
              Connexion
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-bold text-[var(--color-violet)]">
              Créer un compte
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
