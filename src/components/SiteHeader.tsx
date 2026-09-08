import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/session";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Brandy AI, accueil">
          <Logo className="h-7 text-[var(--color-brand)]" />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#methode" className="hidden hover:text-[var(--color-brand)] sm:block">
            Méthode
          </Link>
          <Link href="/#livrables" className="hidden hover:text-[var(--color-brand)] sm:block">
            Livrables
          </Link>
          <Link href="/pricing" className="hover:text-[var(--color-brand)]">
            Tarifs
          </Link>
          {user ? (
            <Link href="/dashboard" className="btn btn-ink">
              Mes projets
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-[var(--color-brand)]">
                Connexion
              </Link>
              <Link href="/register" className="btn btn-primary">
                Commencer
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
