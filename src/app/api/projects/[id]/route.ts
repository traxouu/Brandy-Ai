import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parseProject } from "@/lib/project";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

  return NextResponse.json(parseProject(project));
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const { count } = await prisma.project.deleteMany({ where: { id, userId: user.id } });
  if (count === 0) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
