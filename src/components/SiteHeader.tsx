import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/session";

/**
 * Barre de navigation : le logo seul à gauche, l'appel à l'action à droite.
 * Aucun lien de menu — la page se lit en descendant.
 */
export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-filet)] bg-[var(--color-ivoire)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Cally Leads, accueil" className="shrink-0">
          <LogoMark className="h-9 text-[var(--color-violet)]" />
        </Link>

        {user ? (
          <Link href="/dashboard" className="btn btn-primary px-6 py-2.5">
            Mes leads
          </Link>
        ) : (
          <Link href="/register" className="btn btn-primary px-6 py-2.5">
            Essayer gratuitement
          </Link>
        )}
      </div>
    </header>
  );
}
