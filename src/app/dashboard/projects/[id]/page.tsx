import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { parseProject } from "@/lib/project";
import { hasApiKey } from "@/lib/anthropic";
import BrandStudio from "@/components/brand/BrandStudio";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autostart?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const user = await requireUser();
  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  return { title: project ? `${project.name} — Cally Leads` : "Projet — Cally Leads" };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const { autostart } = await searchParams;

  const record = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!record) notFound();

  return (
    <BrandStudio
      project={parseProject(record)}
      autostart={autostart === "1"}
      apiKeyConfigured={hasApiKey()}
    />
  );
}
