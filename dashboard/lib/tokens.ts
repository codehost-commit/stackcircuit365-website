import { createHmac, timingSafeEqual } from "node:crypto";
import { LINK_SECRET } from "./config";

/**
 * Signed, single-use-ish, short-expiry tokens for email action links. The link
 * only *identifies* the action — performing it still requires an authenticated
 * session on the dashboard, so a leaked link cannot change production by itself.
 */
export interface ActionClaim {
  projectId: string;
  incidentId: string;
  action: "approve_rollback" | "view";
  exp: number; // epoch seconds
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function signAction(claim: Omit<ActionClaim, "exp">, ttlSeconds = 3600): string {
  const full: ActionClaim = { ...claim, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const payload = b64url(JSON.stringify(full));
  const sig = createHmac("sha256", LINK_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAction(token: string): ActionClaim | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", LINK_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const claim = JSON.parse(Buffer.from(payload, "base64url").toString()) as ActionClaim;
    if (claim.exp < Math.floor(Date.now() / 1000)) return null;
    return claim;
  } catch {
    return null;
  }
}
