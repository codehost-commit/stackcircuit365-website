import { DEMO_MODE } from "./config";
import {
  DEMO_PROJECT,
  DEMO_OVERVIEW,
  DEMO_INCIDENTS,
  DEMO_DEPLOYS,
  DEMO_ALERTS
} from "./demo";
import type { Project, Incident, Deploy, Alert, Overview } from "./types";

/**
 * Data access layer. In demo mode it returns the seed dataset so the whole
 * dashboard is browsable with zero setup. When DATABASE_URL is configured the
 * Prisma-backed branches take over (see prisma/schema.prisma). Every function
 * is scoped by the signed-in user's project ownership at the call site.
 */

export async function listProjects(_userId: string): Promise<Project[]> {
  if (DEMO_MODE) return [DEMO_PROJECT];
  const { prisma } = await import("./prisma");
  const rows = await prisma.project.findMany({
    where: { ownerId: _userId },
    orderBy: { createdAt: "desc" }
  });
  return rows.map(mapProject);
}

export async function getProject(
  userId: string,
  projectId: string
): Promise<Project | null> {
  if (DEMO_MODE) return projectId === DEMO_PROJECT.id ? DEMO_PROJECT : null;
  const { prisma } = await import("./prisma");
  const row = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId }
  });
  return row ? mapProject(row) : null;
}

export async function getOverview(projectId: string): Promise<Overview> {
  if (DEMO_MODE) return DEMO_OVERVIEW;
  const { prisma } = await import("./prisma");
  const [deploys, incidents] = await Promise.all([
    prisma.deployment.count({ where: { projectId } }),
    prisma.incident.count({ where: { projectId, status: { in: ["recovered", "resolved"] } } })
  ]);
  return {
    deploysWatched: deploys,
    incidentsContained: incidents,
    healthyToday: 100,
    versionsSaved: await prisma.deployment.count({ where: { projectId, knownGood: true } }),
    checksToday: 0,
    lastCheckAt: "just now"
  };
}

export async function listIncidents(projectId: string): Promise<Incident[]> {
  if (DEMO_MODE) return DEMO_INCIDENTS;
  const { prisma } = await import("./prisma");
  const rows = await prisma.incident.findMany({
    where: { projectId },
    orderBy: { openedAt: "desc" },
    take: 50
  });
  return rows.map(mapIncident);
}

export async function getIncident(
  projectId: string,
  id: string
): Promise<Incident | null> {
  if (DEMO_MODE) return DEMO_INCIDENTS.find((i) => i.id === id) ?? null;
  const { prisma } = await import("./prisma");
  const row = await prisma.incident.findFirst({ where: { id, projectId } });
  return row ? mapIncident(row) : null;
}

export async function listDeploys(projectId: string): Promise<Deploy[]> {
  if (DEMO_MODE) return DEMO_DEPLOYS;
  const { prisma } = await import("./prisma");
  const rows = await prisma.deployment.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return rows.map(mapDeploy);
}

export async function listAlerts(projectId: string): Promise<Alert[]> {
  if (DEMO_MODE) return DEMO_ALERTS;
  const { prisma } = await import("./prisma");
  const rows = await prisma.alert.findMany({
    where: { projectId },
    orderBy: { at: "desc" },
    take: 50
  });
  return rows.map((r: any) => ({
    id: r.id,
    at: r.at.toISOString(),
    channel: r.channel as Alert["channel"],
    subject: r.subject,
    incidentId: r.incidentId ?? undefined
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProject(r: any): Project {
  return {
    id: r.id,
    name: r.name,
    productionUrl: r.productionUrl,
    status: r.status,
    recoveryMode: r.recoveryMode,
    liveDeploymentId: r.liveDeploymentId ?? "",
    knownGoodId: r.knownGoodId ?? ""
  };
}
function mapIncident(r: any): Incident {
  return {
    id: r.id,
    kind: r.kind,
    severity: r.severity,
    status: r.status,
    confidence: r.confidence,
    suspectDeploymentId: r.suspectDeploymentId ?? undefined,
    suspectCommit: r.suspectCommit ?? undefined,
    rollbackTargetId: r.rollbackTargetId ?? undefined,
    openedAt: typeof r.openedAt === "string" ? r.openedAt : r.openedAt.toISOString(),
    closedAt: r.closedAt ? (typeof r.closedAt === "string" ? r.closedAt : r.closedAt.toISOString()) : undefined,
    action: r.action,
    timeline: (r.timeline as any) ?? [],
    needsApproval: r.status === "needs_human" || r.status === "rollback_recommended"
  };
}
function mapDeploy(r: any): Deploy {
  return {
    id: r.id,
    commit: r.commit ?? "",
    message: r.message ?? "",
    state: r.state,
    target: r.target,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt.toISOString(),
    knownGood: !!r.knownGood
  };
}
