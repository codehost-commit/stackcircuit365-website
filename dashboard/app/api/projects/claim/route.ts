import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { hashKey } from "@/lib/agentAuth";
import { hasDatabase } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Claim (or create-and-claim) a project by pasting the key the agent generated.
 * Pasting happens in an authenticated POST body — never in a URL — so a leaked
 * key alone cannot be used to view or control the project without also signing
 * in as its owner.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  if (!hasDatabase) {
    return NextResponse.json({ ok: false, error: "Dashboard is in demo mode." }, { status: 503 });
  }

  const { key } = (await req.json().catch(() => ({}))) as { key?: string };
  if (!key || key.length < 8) {
    return NextResponse.json({ ok: false, error: "Enter a valid project key." }, { status: 400 });
  }

  const { prisma } = await import("@/lib/prisma");
  const keyHash = hashKey(key);
  const existing = await prisma.project.findUnique({ where: { keyHash } });

  if (existing) {
    if (existing.ownerId && existing.ownerId !== user.id) {
      return NextResponse.json({ ok: false, error: "That project is owned by another account." }, { status: 409 });
    }
    if (!existing.ownerId || existing.ownerId !== user.id) {
      await prisma.project.update({
        where: { id: existing.id },
        data: { ownerId: user.id, ownerLogin: user.login ?? null }
      });
    }
    return NextResponse.json({ ok: true, projectId: existing.id });
  }

  const project = await prisma.project.create({
    data: {
      name: "New project",
      productionUrl: "",
      ownerId: user.id,
      ownerLogin: user.login ?? null,
      keyHash,
      keyPrefix: key.slice(0, 12)
    }
  });
  return NextResponse.json({ ok: true, projectId: project.id });
}
