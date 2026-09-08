import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-5 text-[var(--color-brand)]" />
          <span>— votre directeur créatif, à la demande.</span>
        </div>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-[var(--color-brand)]">
            Tarifs
          </Link>
          <Link href="/login" className="hover:text-[var(--color-brand)]">
            Connexion
          </Link>
          <Link href="/register" className="hover:text-[var(--color-brand)]">
            Créer un compte
          </Link>
        </div>
      </div>
    </footer>
  );
}
