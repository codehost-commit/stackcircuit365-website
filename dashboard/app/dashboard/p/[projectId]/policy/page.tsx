import { getProject } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { Shell, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

const MODES = [
  { key: "observe", label: "Observe", desc: "Detect and report only. Never changes production." },
  { key: "approval", label: "Approval", desc: "Recommend a rollback and wait for your approval." },
  { key: "guarded", label: "Guarded", desc: "Auto-fix non-critical regressions; wait on a total outage." },
  { key: "auto", label: "Auto", desc: "Auto-fix whenever all ten gates pass, then report." }
];

const GATES = [
  "Opted into automated recovery",
  "A production deployment happened recently",
  "A verified-healthy rollback target exists",
  "Multiple consecutive health checks failing",
  "Failure began shortly after the deploy",
  "App is clearly erroring or unreachable",
  "No third-party dependency outage",
  "No database / auth / billing / secret change",
  "No incident lock active",
  "High confidence the deploy caused it"
];

export default async function Policy({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;

  return (
    <Shell title={project.name} subtitle="Recovery policy" status={project.status}>
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">Recovery mode</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => {
          const active = m.key === project.recoveryMode;
          return (
            <div
              key={m.key}
              className={`border p-4 ${active ? "border-signal bg-[#f3faf5]" : "border-line bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] uppercase tracking-wider text-ink">{m.label}</span>
                {active ? (
                  <Chip tone="green">active</Chip>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">available</span>
                )}
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{m.desc}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
        Auto-rollback safety gates
      </h2>
      <div className="border border-line bg-white">
        {GATES.map((g, i) => (
          <div key={g} className="flex items-center gap-3 border-b border-line2 px-4 py-3 last:border-0">
            <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-[13px] text-ink/85">{g}</span>
            <span className="h-2 w-2 bg-signal" />
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted">
        High-risk changes (migrations, auth, billing, secrets) and dependency outages always stop
        automation and ask a human — in every mode.
      </p>
    </Shell>
  );
}
