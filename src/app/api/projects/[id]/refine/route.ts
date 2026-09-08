import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parseProject } from "@/lib/project";
import { SECTION_KEYS, identitySchema } from "@/lib/brand-schema";
import { MissingApiKeyError, effortForPlan, hasApiKey, refineSection } from "@/lib/anthropic";

export const maxDuration = 800;

const bodySchema = z.object({
  section: z.enum(SECTION_KEYS),
  instruction: z.string().trim().max(600).default(""),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY n'est pas configurée sur ce serveur." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Section inconnue." }, { status: 400 });
  }

  const { id } = await params;
  const record = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!record) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

  const project = parseProject(record);
  if (!project.identity) {
    return NextResponse.json(
      { error: "Générez d'abord l'identité complète avant de retravailler une section." },
      { status: 409 }
    );
  }

  try {
    const { section, instruction } = parsed.data;
    const next = await refineSection(
      section,
      project.brief,
      project.identity,
      instruction,
      { effort: effortForPlan(user.plan), signal: request.signal }
    );

    const identity = identitySchema.parse({ ...project.identity, [section]: next });

    await prisma.project.update({
      where: { id: record.id },
      data: { identity: JSON.stringify(identity), status: "ready", error: null },
    });

    return NextResponse.json({ identity });
  } catch (error) {
    const message =
      error instanceof MissingApiKeyError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Erreur pendant la régénération.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
