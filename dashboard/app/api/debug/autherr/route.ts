import { NextResponse } from "next/server";
import { getAuthError, getAuthErrorsFromDb } from "@/lib/authDebug";

export const dynamic = "force-dynamic";

/** Temporary: returns the last captured NextAuth error(s) for diagnosis. */
export async function GET() {
  const memory = getAuthError();
  const db = await getAuthErrorsFromDb();
  return NextResponse.json({ ok: true, memory, db });
}
