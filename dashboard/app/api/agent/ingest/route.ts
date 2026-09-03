import { NextResponse } from "next/server";
import { bearer, projectForKey } from "@/lib/agentAuth";
import { hasDatabase } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * The self-hosted agent pushes events here, authenticated with its project key
 * (Bearer). Non-secret metadata only — deploys, health/incidents, project
 * status. The dashboard never receives production tokens.
 *
 * Body: { type, project?, deployment?, incident?, alert? }
 */
export async function POST(req: Request) {
  if (!hasDatabase) return NextResponse.json({ ok: false, error: "demo" }, { status: 503 });
  const key = bearer(req);
  if (!key) return NextResponse.json({ ok: false, error: "missing key" }, { status: 401 });
  const project = await projectForKey(key);
  if (!project) return NextResponse.json({ ok: false, error: "invalid key" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  await prisma.project.update({
    where: { id: project.id },
    data: {
      lastSeenAt: new Date(),
      ...(body.project ? (body.project as Record<string, unknown>) : {})
    }
  });

  const type = body.type as string;
  if (type === "deployment" && body.deployment) {
    const d = body.deployment as Record<string, unknown>;
    await prisma.deployment.upsert({
      where: { id: d.id as string },
      create: {
        id: d.id as string,
        projectId: project.id,
        commit: (d.commitSha as string) ?? null,
        message: (d.commitMessage as string) ?? null,
        state: (d.state as string) ?? "ready",
        target: (d.target as string) ?? "production",
        knownGood: false
      },
      update: {
        state: (d.state as string) ?? "ready",
        knownGood: (d.knownGood as boolean) ?? undefined
      }
    });
  } else if (type === "incident" && body.incident) {
    const i = body.incident as Record<string, unknown>;
    await prisma.incident.upsert({
      where: { id: i.id as string },
      create: {
        id: i.id as string,
        projectId: project.id,
        kind: (i.kind as string) ?? "unknown",
        severity: (i.severity as string) ?? "major",
        status: (i.status as string) ?? "open",
        confidence: (i.confidence as number) ?? 0,
        suspectDeploymentId: (i.suspectDeploymentId as string) ?? null,
        suspectCommit: (i.suspectCommitSha as string) ?? null,
        rollbackTargetId: (i.rollbackTargetId as string) ?? null,
        action: (i.action as string) ?? "report_only",
        timeline: (i.timeline as object) ?? []
      },
      update: {
        status: (i.status as string) ?? undefined,
        action: (i.action as string) ?? undefined,
        confidence: (i.confidence as number) ?? undefined,
        timeline: (i.timeline as object) ?? undefined,
        closedAt: i.closedAt ? new Date(i.closedAt as string) : undefined
      }
    });
  }

  return NextResponse.json({ ok: true });
}
