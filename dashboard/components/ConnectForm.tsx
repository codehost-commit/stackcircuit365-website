"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectForm() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function claim() {
    setState("working");
    setMsg("");
    try {
      const res = await fetch("/api/projects/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: key.trim() })
      });
      const body = (await res.json()) as { ok: boolean; projectId?: string; error?: string };
      if (body.ok && body.projectId) {
        router.push(`/p/${body.projectId}`);
      } else {
        setState("error");
        setMsg(body.error ?? "That key was not recognized.");
      }
    } catch {
      setState("error");
      setMsg("Something went wrong. Try again.");
    }
  }

  return (
    <div className="mt-5">
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="sck_live_..."
        className="w-full border border-line bg-paper px-3 py-2.5 font-mono text-[13px] text-ink outline-none focus:border-ink"
      />
      <button
        type="button"
        onClick={claim}
        disabled={state === "working" || key.trim().length < 8}
        className="mt-3 w-full bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper disabled:opacity-50"
      >
        {state === "working" ? "Connecting…" : "Connect project"}
      </button>
      {msg ? <p className="mt-3 font-mono text-[11px] text-alert">{msg}</p> : null}
    </div>
  );
}
