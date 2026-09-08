import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { credentialsSchema, verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = credentialsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Adresse email ou mot de passe invalide." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Message identique dans les deux cas : ne pas révéler l'existence d'un compte.
  const invalid = NextResponse.json(
    { error: "Adresse email ou mot de passe incorrect." },
    { status: 401 }
  );

  if (!user) {
    // Comparaison à vide pour garder un temps de réponse comparable.
    await verifyPassword(parsed.data.password, "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin");
    return invalid;
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return invalid;

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
