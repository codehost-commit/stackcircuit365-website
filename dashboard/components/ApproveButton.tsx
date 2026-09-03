"use client";

import { useState } from "react";

export default function ApproveButton({
  projectId,
  incidentId,
  targetId
}: {
  projectId: string;
  incidentId: string;
  targetId?: string;
}) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  async function approve() {
    setState("working");
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId, incidentId, kind: "rollback", targetId })
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <span className="inline-block bg-[#e6f2ea] px-4 py-2.5 font-mono text-[12px] uppercase tracking-widest text-signal">
        ✓ Approved — your agent will roll back to {targetId ?? "the last good release"}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={approve}
      disabled={state === "working"}
      className="bg-ink px-4 py-2.5 font-mono text-[12px] uppercase tracking-widest text-paper disabled:opacity-60"
    >
      {state === "working" ? "Approving…" : "Approve rollback"}
      {state === "error" ? " — retry" : ""}
    </button>
  );
}
