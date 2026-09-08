import type { Project } from "@prisma/client";
import { briefSchema, identitySchema, type BrandIdentity, type Brief } from "@/lib/brand-schema";

export interface ParsedProject {
  id: string;
  name: string;
  status: string;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  brief: Brief;
  identity: BrandIdentity | null;
}

function safeParse<T>(raw: string | null, parser: (value: unknown) => T): T | null {
  if (!raw) return null;
  try {
    return parser(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function parseProject(project: Project): ParsedProject {
  const brief =
    safeParse(project.brief, (v) => briefSchema.parse(v)) ??
    briefSchema.parse({
      brandName: project.name,
      industry: "—",
      offer: "Brief illisible : recréez le projet.",
    });

  return {
    id: project.id,
    name: project.name,
    status: project.status,
    error: project.error,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    brief,
    identity: safeParse(project.identity, (v) => identitySchema.parse(v)),
  };
}
