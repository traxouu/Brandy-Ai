"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan } from "@/lib/plans";
import { formatLimit } from "@/lib/plans";

interface Props {
  plan: Plan;
  currentPlan: string | null;
  authenticated: boolean;
}

export default function PlanCard({ plan, currentPlan, authenticated }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCurrent = currentPlan === plan.id;

  async function subscribe() {
    if (!authenticated) {
      router.push("/register");
      return;
    }
    if (plan.id === "free") {
      router.push("/dashboard");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Impossible de démarrer l'abonnement.");
        setPending(false);
        return;
      }

      if (body.demo) {
        router.push(body.url);
        router.refresh();
        return;
      }

      window.location.href = body.url;
    } catch {
      setError("Impossible de joindre le serveur.");
      setPending(false);
    }
  }

  return (
    <div
      className={`card flex flex-col p-7 ${
        plan.highlight
          ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]"
          : ""
      }`}
    >
      {plan.highlight && (
        <span className="mb-3 self-start rounded-full bg-[var(--color-brand)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-cream)]">
          Le plus choisi
        </span>
      )}

      <h3 className="text-xl">{plan.name}</h3>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{plan.tagline}</p>

      <p className="mt-6 font-logo text-5xl leading-none">
        {plan.price === 0 ? "0 €" : `${plan.price} €`}
        <span className="text-sm font-normal text-[var(--color-ink-muted)]"> / mois</span>
      </p>

      <p className="mt-3 text-sm font-bold text-[var(--color-brand)]">
        {formatLimit(plan)} projet{plan.projectLimit === 1 ? "" : "s"} de marque
      </p>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--color-ink-soft)]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <span className="mt-[0.35em] block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
            {feature}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 text-xs text-[var(--color-brand-dark)]">{error}</p>
      )}

      <button
        onClick={subscribe}
        disabled={pending || isCurrent}
        className={`btn mt-7 w-full py-3 ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
      >
        {isCurrent
          ? "Votre plan actuel"
          : pending
            ? "Redirection…"
            : plan.price === 0
              ? "Commencer gratuitement"
              : `Passer au plan ${plan.name}`}
      </button>
    </div>
  );
}
