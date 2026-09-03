import { NextResponse } from "next/server";
import { getAuthErrorsFromDb } from "@/lib/authDebug";

export const dynamic = "force-dynamic";

/** Temporary: returns the last captured auth diagnostics for analysis. */
export async function GET() {
  const db = await getAuthErrorsFromDb();
  return NextResponse.json({ ok: true, db });
}
