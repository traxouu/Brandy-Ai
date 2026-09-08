export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-line)] bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
      {children}
    </span>
  );
}

export function List({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "positive" | "negative" }) {
  const dot =
    tone === "positive"
      ? "bg-[var(--color-ink)]"
      : tone === "negative"
        ? "bg-[var(--color-brand)]"
        : "bg-[var(--color-ink-muted)]";

  return (
    <ul className="space-y-2.5 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className={`mt-[0.55em] block h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
