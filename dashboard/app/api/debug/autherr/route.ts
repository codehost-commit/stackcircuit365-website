import { NextResponse } from "next/server";
import { getAuthError } from "@/lib/authDebug";

export const dynamic = "force-dynamic";

/** Temporary: returns the last captured NextAuth error for diagnosis. */
export async function GET() {
  return NextResponse.json({ ok: true, error: getAuthError() });
}
