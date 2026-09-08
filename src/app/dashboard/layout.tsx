import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/session";
import { getPlan } from "@/lib/plans";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const plan = getPlan(user.plan);

  return (
    <div className="relative z-10 min-h-screen">
      <header className="no-print border-b border-[var(--color-filet)] bg-[var(--color-ivoire)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" aria-label="Cally Leads, tableau de bord">
              <Logo className="h-6 text-[var(--color-violet)]" />
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-[var(--color-violet)]">
                Projets
              </Link>
              <Link href="/dashboard/billing" className="hover:text-[var(--color-violet)]">
                Abonnement
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--color-encre-tenue)] sm:block">
              {user.name} · plan{" "}
              <span className="font-bold text-[var(--color-violet)]">{plan.name}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
