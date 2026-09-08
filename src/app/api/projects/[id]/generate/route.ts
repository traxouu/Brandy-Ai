import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parseProject } from "@/lib/project";
import {
  MissingApiKeyError,
  effortForPlan,
  generateIdentity,
  hasApiKey,
} from "@/lib/anthropic";

export const maxDuration = 800;
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function sse(event: string, data: unknown) {
  return new TextEncoder().encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  );
}

export async function POST(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return new Response("Non authentifié.", { status: 401 });

  const { id } = await params;
  const record = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!record) return new Response("Projet introuvable.", { status: 404 });

  if (!hasApiKey()) {
    return new Response(
      "ANTHROPIC_API_KEY n'est pas configurée sur ce serveur.",
      { status: 503 }
    );
  }

  const project = parseProject(record);
  const effort = effortForPlan(user.plan);

  await prisma.project.update({
    where: { id: record.id },
    data: { status: "generating", error: null },
  });

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: string, data: unknown) => {
        if (!closed) controller.enqueue(sse(event, data));
      };

      const heartbeat = setInterval(() => {
        // Garde la connexion ouverte derrière les proxies pendant la réflexion.
        if (!closed) controller.enqueue(new TextEncoder().encode(": ping\n\n"));
      }, 15000);

      try {
        send("status", { phase: "thinking", message: "Analyse du brief…" });

        let lastSent = 0;
        const identity = await generateIdentity(project.brief, {
          effort,
          signal: request.signal,
          onProgress: ({ outputTokens }) => {
            const now = Date.now();
            if (now - lastSent < 400) return;
            lastSent = now;
            send("progress", { outputTokens });
          },
        });

        await prisma.project.update({
          where: { id: record.id },
          data: {
            status: "ready",
            identity: JSON.stringify(identity),
            error: null,
            name: project.brief.brandName,
          },
        });

        send("done", { identity });
      } catch (error) {
        const message =
          error instanceof MissingApiKeyError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Erreur inconnue pendant la génération.";

        await prisma.project
          .update({
            where: { id: record.id },
            data: { status: "error", error: message.slice(0, 500) },
          })
          .catch(() => undefined);

        send("error", { message });
      } finally {
        clearInterval(heartbeat);
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
