import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getPlan, formatLimit, planAllowsMore } from "@/lib/plans";
import { parseProject } from "@/lib/project";
import ProjectCard from "@/components/ProjectCard";
import { hasApiKey } from "@/lib/anthropic";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes projets — Cally Leads" };

export default async function DashboardPage() {
  const user = await requireUser();
  const plan = getPlan(user.plan);

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const canCreate = planAllowsMore(user.plan, projects.length);
  const parsed = projects.map(parseProject);

  return (
    <>
      {!hasApiKey() && (
        <div className="mb-8 rounded-xl border border-[var(--color-violet)]/30 bg-[var(--color-violet-voile)] px-5 py-4 text-sm text-[var(--color-violet-fonce)]">
          <strong className="font-bold">Configuration incomplète :</strong> la variable
          d&apos;environnement <code className="font-mono">ANTHROPIC_API_KEY</code>{" "}
          n&apos;est pas définie. La création de projets fonctionne, mais la génération
          échouera tant que la clé est absente.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl">Vos marques</h1>
          <p className="mt-2 text-[var(--color-encre-douce)]">
            {projects.length} projet{projects.length === 1 ? "" : "s"} sur{" "}
            {formatLimit(plan)} — plan {plan.name}.
          </p>
        </div>

        {canCreate ? (
          <Link href="/dashboard/new" className="btn btn-primary px-6 py-3">
            Nouveau projet
          </Link>
        ) : (
          <Link href="/pricing" className="btn btn-ink px-6 py-3">
            Augmenter ma capacité
          </Link>
        )}
      </div>

      {plan.leadLimit !== -1 && (
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-ivoire-creuse)]">
          <div
            className="h-full rounded-full bg-[var(--color-violet)] transition-all"
            style={{
              width: `${Math.min(100, (projects.length / plan.leadLimit) * 100)}%`,
            }}
          />
        </div>
      )}

      {parsed.length === 0 ? (
        <div className="card mt-12 px-8 py-20 text-center">
          <p className="font-display-face text-5xl text-[var(--color-violet)]">01</p>
          <h2 className="mt-6 text-2xl">Aucun projet pour l&apos;instant.</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-encre-douce)]">
            Décrivez votre marque en quelques champs : le directeur créatif s&apos;occupe
            de l&apos;audience, du positionnement, du logo, de la palette et des
            typographies.
          </p>
          <Link href="/dashboard/new" className="btn btn-primary mt-8 px-7 py-3">
            Briefer ma première marque
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parsed.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
