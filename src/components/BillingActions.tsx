"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingActions({ hasStripe }: { hasStripe: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? "Impossible d'ouvrir le portail de facturation.");
        setPending(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Impossible de joindre le serveur.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button onClick={() => router.push("/pricing")} className="btn btn-primary px-6 py-3">
        Changer de plan
      </button>

      {hasStripe && (
        <button onClick={openPortal} disabled={pending} className="btn btn-ghost px-6 py-3">
          {pending ? "Ouverture…" : "Gérer ma facturation"}
        </button>
      )}

      {error && <p className="text-sm text-[var(--color-violet-fonce)]">{error}</p>}
    </div>
  );
}
