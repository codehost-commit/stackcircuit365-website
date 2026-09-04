import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getIncident, getOverview } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { Shell, Stat, Chip } from "@/components/ui";
import ApproveButton from "@/components/ApproveButton";

export const dynamic = "force-dynamic";

export default async function IncidentDetail({
  params
}: {
  params: { projectId: string; id: string };
}) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) notFound();
  const [incident, overview] = await Promise.all([
    getIncident(project.id, params.id),
    getOverview(project.id)
  ]);
  if (!incident) notFound();

  const pct = Math.round(incident.confidence * 100);

  return (
    <Shell title={`${incident.id}`} subtitle={`${project.name} · ${incident.kind}`} status={incident.status}>
      <Link
        href={`/dashboard/p/${project.id}/incidents`}
        className="mb-5 inline-block font-mono text-[12px] text-muted hover:text-ink"
      >
        ← All incidents
      </Link>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat value={String(overview.deploysWatched)} label="deploys watched" />
        <Stat value={String(overview.incidentsContained)} label="incidents contained" />
        <Stat value={`${pct}%`} label="attribution confidence" />
      </div>

      <div className="mb-6 border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[14px] text-ink">{incident.id}</span>
          <Chip tone={incident.severity === "critical" ? "red" : "amber"}>{incident.kind}</Chip>
        </div>
        <div className="mt-2 font-mono text-[12px] leading-relaxed text-muted">
          {incident.suspectDeploymentId ?? "no suspect deploy"}
          {incident.suspectCommit ? ` · commit ${incident.suspectCommit}` : ""} · confidence {pct}%
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="font-mono text-[12px] text-ink">
            {incident.action === "auto_rollback"
              ? `Auto-rollback → ${incident.rollbackTargetId}`
              : incident.action === "require_human"
                ? "Automation held — human review"
                : `Rollback target → ${incident.rollbackTargetId ?? "none"}`}
          </span>
          <Chip tone={incident.status === "recovered" ? "green" : incident.needsApproval ? "red" : "muted"}>
            {incident.status}
          </Chip>
        </div>
      </div>

      {incident.needsApproval ? (
        <div className="mb-6 border border-alert/40 bg-[#fdf3f1] p-5">
          <p className="font-mono text-[12px] uppercase tracking-wider text-alert">Action required</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            StackCircuit365 recommends rolling back to{" "}
            <span className="font-mono text-ink">
              {incident.rollbackTargetId ?? "the last verified-healthy release"}
            </span>
            . Approving records your decision; your agent performs the rollback — the dashboard never
            holds your production tokens.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ApproveButton
              projectId={project.id}
              incidentId={incident.id}
              targetId={incident.rollbackTargetId}
            />
            <span className="font-mono text-[11px] text-muted">or leave it held and investigate</span>
          </div>
        </div>
      ) : null}

      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">Timeline</h2>
      <div className="border border-line bg-white">
        {incident.timeline.map((e, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 border-b border-line2 px-4 py-3 font-mono text-[12px] last:border-0"
          >
            <span className="text-muted">{e.at}</span>
            <span className="flex-1 truncate text-ink/85">{e.label}</span>
            {e.tag ? <Chip tone={e.tone ?? "muted"}>{e.tag}</Chip> : null}
          </div>
        ))}
      </div>
    </Shell>
  );
}
