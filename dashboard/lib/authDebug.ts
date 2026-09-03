/**
 * Captures the most recent NextAuth error so it can be read back from a debug
 * endpoint. Writes to the database (survives across serverless instances) with
 * an in-memory fallback. Temporary, best-effort — never throws into the auth flow.
 */
export type AuthErrorRecord = {
  at: string;
  code: string;
  name?: string;
  message?: string;
  opError?: string;
  opDesc?: string;
  stack?: string;
} | null;

const holder = globalThis as unknown as { __scAuthErr?: AuthErrorRecord };

export function recordAuthError(r: AuthErrorRecord): void {
  holder.__scAuthErr = r;
  // Fire-and-forget DB persist so a different instance can read it back.
  void persist(r);
}

async function persist(r: AuthErrorRecord): Promise<void> {
  try {
    const { prisma } = await import("./prisma");
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "_authdbg" (id serial primary key, at timestamptz default now(), payload text)'
    );
    await prisma.$executeRawUnsafe(
      'INSERT INTO "_authdbg"(payload) VALUES ($1)',
      JSON.stringify(r)
    );
  } catch {
    /* best-effort */
  }
}

export function getAuthError(): AuthErrorRecord {
  return holder.__scAuthErr ?? null;
}

export async function getAuthErrorsFromDb(): Promise<unknown[]> {
  try {
    const { prisma } = await import("./prisma");
    const rows = (await prisma.$queryRawUnsafe(
      'SELECT payload, at FROM "_authdbg" ORDER BY id DESC LIMIT 3'
    )) as Array<{ payload: string; at: unknown }>;
    return rows.map((row) => {
      try {
        return { at: row.at, ...JSON.parse(row.payload) };
      } catch {
        return { at: row.at, payload: row.payload };
      }
    });
  } catch (e) {
    return [{ dberror: (e as Error).message }];
  }
}
