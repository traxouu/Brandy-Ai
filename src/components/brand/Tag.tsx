export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-filet)] bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-encre-douce)]">
      {children}
    </span>
  );
}

export function List({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "positive" | "negative" }) {
  const dot =
    tone === "positive"
      ? "bg-[var(--color-encre)]"
      : tone === "negative"
        ? "bg-[var(--color-violet)]"
        : "bg-[var(--color-encre-tenue)]";

  return (
    <ul className="space-y-2.5 text-[0.95rem] leading-relaxed text-[var(--color-encre-douce)]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className={`mt-[0.55em] block h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
