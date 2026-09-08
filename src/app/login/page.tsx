import { redirect } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { Logo } from "@/components/Logo";
import { getUserId } from "@/lib/session";

export const metadata = { title: "Connexion — Cally Leads" };

export default async function LoginPage() {
  if (await getUserId()) redirect("/dashboard");

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-10 flex justify-center" aria-label="Cally Leads, accueil">
        <Logo className="h-9 text-[var(--color-violet)]" />
      </Link>
      <div className="card p-8">
        <h1 className="text-3xl">Content de vous revoir.</h1>
        <p className="mt-2 mb-8 text-sm text-[var(--color-encre-douce)]">
          Reprenez vos projets de marque là où vous les avez laissés.
        </p>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
