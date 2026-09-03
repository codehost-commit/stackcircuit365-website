/**
 * Captures the most recent NextAuth error in memory so it can be read back from
 * a debug endpoint — avoids hunting for it in serverless logs. Temporary.
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
}

export function getAuthError(): AuthErrorRecord {
  return holder.__scAuthErr ?? null;
}
