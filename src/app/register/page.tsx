import { redirect } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { Logo } from "@/components/Logo";
import { getUserId } from "@/lib/session";

export const metadata = { title: "Créer un compte — Brandy AI" };

export default async function RegisterPage() {
  if (await getUserId()) redirect("/dashboard");

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-10 text-center text-3xl">
        <Logo />
      </Link>
      <div className="card p-8">
        <h1 className="text-3xl">Construisons votre marque.</h1>
        <p className="mt-2 mb-8 text-sm text-[var(--color-ink-soft)]">
          Le plan Découverte vous offre un projet complet, sans carte bancaire.
        </p>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
