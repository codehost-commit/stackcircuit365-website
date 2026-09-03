import { createHash } from "node:crypto";

export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/** Extract a bearer project key from a request's Authorization header. */
export function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1]!.trim() : null;
}

/** Resolve the project a bearer key belongs to (DB required). */
export async function projectForKey(key: string) {
  const { prisma } = await import("./prisma");
  return prisma.project.findUnique({ where: { keyHash: hashKey(key) } });
}
