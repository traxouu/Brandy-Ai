import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { briefSchema } from "@/lib/brand-schema";
import { getPlan, planAllowsMoreProjects } from "@/lib/plans";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = briefSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Brief incomplet." },
      { status: 400 }
    );
  }

  const count = await prisma.project.count({ where: { userId: user.id } });
  if (!planAllowsMoreProjects(user.plan, count)) {
    const plan = getPlan(user.plan);
    return NextResponse.json(
      {
        error: `Votre plan ${plan.name} est limité à ${plan.projectLimit} projet(s). Passez à un plan supérieur pour en créer davantage.`,
        code: "PLAN_LIMIT",
      },
      { status: 402 }
    );
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: parsed.data.brandName,
      brief: JSON.stringify(parsed.data),
      status: "draft",
    },
  });

  return NextResponse.json({ id: project.id });
}
