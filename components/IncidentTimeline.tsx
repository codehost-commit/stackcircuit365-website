"use client";

import { useState } from "react";

type Kind = "deploy" | "warn" | "incident" | "action" | "ok";

const marker: Record<Kind, string> = {
  deploy: "#0b0c0e",
  warn: "#a15c00",
  incident: "#b42318",
  action: "#0b0c0e",
  ok: "#0f7a3d"
};

const tag: Record<Kind, string> = {
  deploy: "DEPLOY",
  warn: "HEALTH",
  incident: "INCIDENT",
  action: "ACTION",
  ok: "RECOVERED"
};

const events: { t: string; kind: Kind; title: string; body: string }[] = [
  {
    t: "14:02:11",
    kind: "deploy",
    title: "Production deployment promoted",
    body: 'Vercel promoted dpl_7c33a to production and StackCircuit365 linked it to commit e9f14a2 "add pricing table query".'
  },
  {
    t: "14:03:47",
    kind: "warn",
    title: "Health checks start failing",
    body: "Four checks in a row on /api/health returned 500. Median latency climbed past three seconds."
  },
  {
    t: "14:04:05",
    kind: "incident",
    title: "Incident opened",
    body: "Failure onset matches the deploy from 1m 54s earlier. No known dependency outage. Confidence score 0.93."
  },
  {
    t: "14:04:20",
    kind: "action",
    title: "Rollback recommended",
    body: "The last verified healthy release is dpl_6b0f9. In Approval Required mode the recommendation goes to your dashboard and Slack."
  },
  {
    t: "14:05:38",
    kind: "ok",
    title: "Recovery verified",
    body: "After approval the rollback to dpl_6b0f9 completed. Ten checks passed over 70 seconds and the incident closed with a full timeline."
  }
];

export default function IncidentTimeline() {
  const [step, setStep] = useState(1);
  const done = step >= events.length;

  return (
    <div className="border border-line bg-card">
      <div className="flex flex-col gap-3 border-b border-line2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-signal" aria-hidden="true" />
          <span className="font-mono text-[12px] text-ink">
            production // app.example.dev
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Approval Required mode
        </span>
      </div>

      <div className="px-5 py-6">
        <ol className="flex flex-col">
          {events.slice(0, step).map((e, i) => (
            <li key={e.t} className="grid grid-cols-[auto_1fr] gap-x-4">
              <div className="flex flex-col items-center">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0"
                  style={{ backgroundColor: marker[e.kind] }}
                  aria-hidden="true"
                />
                {i < step - 1 ? (
                  <span className="my-1 w-px flex-1 bg-line" aria-hidden="true" />
                ) : null}
              </div>
              <div className={i < step - 1 ? "pb-6" : ""}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-muted tabular-nums">
                    {e.t}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: marker[e.kind] }}
                  >
                    {tag[e.kind]}
                  </span>
                </div>
                <p className="mt-1.5 text-[15px] font-medium text-ink">
                  {e.title}
                </p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  {e.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex items-center gap-3 border-t border-line2 pt-5">
          {!done ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(events.length, s + 1))}
              className="bg-ink px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-paper"
            >
              Advance timeline
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border border-ink px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-ink"
            >
              Replay
            </button>
          )}
          <span className="font-mono text-[12px] text-muted tabular-nums">
            {String(step).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
