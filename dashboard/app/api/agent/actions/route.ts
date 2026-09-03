import { NextResponse } from "next/server";
import { bearer, projectForKey } from "@/lib/agentAuth";
import { hasDatabase } from "@/lib/config";

export const dynamic = "force-dynamic";

/** The agent polls for approved actions to execute. */
export async function GET(req: Request) {
  if (!hasDatabase) return NextResponse.json({ actions: [] });
  const key = bearer(req);
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 401 });
  const project = await projectForKey(key);
  if (!project) return NextResponse.json({ error: "invalid key" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");
  const actions = await prisma.approvalAction.findMany({
    where: { projectId: project.id, status: "pending" },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ actions });
}

/** The agent acknowledges an action it executed. Body: { id, status, result } */
export async function POST(req: Request) {
  if (!hasDatabase) return NextResponse.json({ ok: false }, { status: 503 });
  const key = bearer(req);
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 401 });
  const project = await projectForKey(key);
  if (!project) return NextResponse.json({ error: "invalid key" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");
  const body = (await req.json().catch(() => ({}))) as { id?: string; status?: string; result?: string };
  if (!body.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });

  await prisma.approvalAction.update({
    where: { id: body.id },
    data: { status: body.status ?? "done", result: body.result ?? null, ackedAt: new Date() }
  });
  await prisma.auditEntry.create({
    data: { projectId: project.id, actor: "agent", action: `executed action ${body.id}`, detail: body.result ?? null }
  });
  return NextResponse.json({ ok: true });
}
