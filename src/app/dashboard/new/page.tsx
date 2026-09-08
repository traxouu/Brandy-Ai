import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { planAllowsMoreProjects } from "@/lib/plans";
import BriefForm from "@/components/BriefForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nouveau projet — Brandy AI" };

export default async function NewProjectPage() {
  const user = await requireUser();
  const count = await prisma.project.count({ where: { userId: user.id } });
  if (!planAllowsMoreProjects(user.plan, count)) redirect("/pricing");

  return (
    <>
      <Link
        href="/dashboard"
        className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand)]"
      >
        ← Retour aux projets
      </Link>

      <h1 className="mt-4 text-4xl">Le brief</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
        Répondez comme vous le feriez à un directeur artistique en rendez-vous.
        Les champs marqués d&apos;une astérisque sont indispensables ; le reste
        affine la direction.
      </p>

      <div className="mt-10 max-w-3xl">
        <BriefForm />
      </div>
    </>
  );
}
