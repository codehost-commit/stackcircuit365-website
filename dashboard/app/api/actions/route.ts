import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getProject } from "@/lib/data";
import { DEMO_MODE } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * A signed-in human approves a recovery action. We record the DECISION only —
 * the self-hosted agent polls GET /api/agent/actions and performs the rollback
 * with its own production credentials. The dashboard never holds those tokens.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    incidentId?: string;
    kind?: string;
    targetId?: string;
  };
  if (!body.projectId || !body.incidentId || !body.kind) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const project = await getProject(user.id, body.projectId);
  if (!project) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  if (DEMO_MODE) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { prisma } = await import("@/lib/prisma");
  const action = await prisma.approvalAction.create({
    data: {
      projectId: project.id,
      incidentId: body.incidentId,
      kind: body.kind,
      targetId: body.targetId ?? null,
      requestedBy: user.login ?? user.id
    }
  });
  await prisma.auditEntry.create({
    data: {
      projectId: project.id,
      actor: user.login ?? user.id,
      action: `approved ${body.kind}`,
      detail: `incident ${body.incidentId} → ${body.targetId ?? ""}`
    }
  });
  return NextResponse.json({ ok: true, actionId: action.id });
}
