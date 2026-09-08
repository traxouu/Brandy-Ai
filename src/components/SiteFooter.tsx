import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-filet)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-[var(--color-encre-tenue)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="h-6 text-[var(--color-violet)]" />
          <span>Cally Leads — les rendez-vous qui valent le déplacement.</span>
        </div>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-[var(--color-violet)]">
            Tarifs
          </Link>
          <Link href="/login" className="hover:text-[var(--color-violet)]">
            Connexion
          </Link>
        </div>
      </div>
    </footer>
  );
}
