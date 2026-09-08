export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-logo inline-flex items-baseline gap-[0.12em] ${className}`}>
      <span className="text-[var(--color-ink)]">Brandy</span>
      <span className="text-[var(--color-brand)]">AI</span>
    </span>
  );
}
