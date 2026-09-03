/**
 * Best-effort diagnostics: persists small JSON records to the DB so a debug
 * endpoint can read them back across serverless instances. Awaited by callers
 * inside the request flow so the write actually completes. Never throws.
 */
export async function saveDbg(obj: unknown): Promise<void> {
  try {
    const { prisma } = await import("./prisma");
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "_authdbg" (id serial primary key, at timestamptz default now(), payload text)'
    );
    await prisma.$executeRawUnsafe(
      'INSERT INTO "_authdbg"(payload) VALUES ($1)',
      JSON.stringify(obj)
    );
  } catch {
    /* best-effort */
  }
}

export async function getAuthErrorsFromDb(): Promise<unknown[]> {
  try {
    const { prisma } = await import("./prisma");
    const rows = (await prisma.$queryRawUnsafe(
      'SELECT payload, at FROM "_authdbg" ORDER BY id DESC LIMIT 6'
    )) as Array<{ payload: string; at: unknown }>;
    return rows.map((row) => {
      try {
        return { at: row.at, ...(JSON.parse(row.payload) as object) };
      } catch {
        return { at: row.at, payload: row.payload };
      }
    });
  } catch (e) {
    return [{ dberror: (e as Error).message }];
  }
}
