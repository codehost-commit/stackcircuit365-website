import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getIncident, getOverview } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { AppSurface, Stat, Chip } from "@/components/ui";
import ApproveButton from "@/components/ApproveButton";

export const dynamic = "force-dynamic";

const TABS = ["Overview", "Timeline", "Evidence"];

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
    <div>
      <Link
        href={`/dashboard/p/${project.id}/incidents`}
        className="mb-3 inline-block font-mono text-[12px] text-muted hover:text-ink"
      >
        ← Incidents
      </Link>
      <AppSurface
        path={`stackcircuit.dev/dashboard/p/${project.id}/incidents/${incident.id}`}
        title={project.name}
        status={incident.status}
      >
        {/* tabs */}
        <div className="flex items-center gap-5 border-b border-black/10 px-5 py-2.5 font-mono text-[12px]">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={i === 0 ? "-mb-[11px] border-b-2 border-ink pb-[9px] text-ink" : "text-muted"}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 p-5">
          <Stat value={String(overview.deploysWatched)} label="deploys watched" />
          <Stat value={String(overview.incidentsContained)} label="incidents contained" />
        </div>

        {/* incident card */}
        <div className="mx-5 border border-black/10 bg-[#faf9f6] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[14px] text-ink">{incident.id}</span>
            <Chip tone={incident.severity === "critical" ? "red" : "amber"}>{incident.kind}</Chip>
          </div>
          <div className="mt-2 font-mono text-[12px] leading-relaxed text-muted">
            {incident.suspectDeploymentId ?? "no suspect deploy"}
            {incident.suspectCommit ? ` · commit ${incident.suspectCommit}` : ""} · confidence {pct}%
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/10 pt-3">
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

        {/* approval panel */}
        {incident.needsApproval ? (
          <div className="mx-5 mt-4 border border-alert/40 bg-[#fdf3f1] p-4">
            <p className="font-mono text-[12px] uppercase tracking-wider text-alert">Action required</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              StackCircuit365 recommends rolling back to{" "}
              <span className="font-mono text-ink">{incident.rollbackTargetId ?? "the last verified-healthy release"}</span>.
              Approving records your decision; your agent performs the rollback — the dashboard never holds your production tokens.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ApproveButton
                projectId={project.id}
                incidentId={incident.id}
                targetId={incident.rollbackTargetId}
              />
              <span className="font-mono text-[11px] text-muted">or leave it held and investigate</span>
            </div>
          </div>
        ) : null}

        {/* timeline */}
        <div className="p-5">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">Timeline</div>
          <div className="border border-black/10">
            {incident.timeline.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 border-b border-black/[0.07] px-3.5 py-2.5 font-mono text-[12px] last:border-0"
              >
                <span className="text-muted">{e.at}</span>
                <span className="flex-1 truncate text-ink/85">{e.label}</span>
                {e.tag ? <Chip tone={e.tone ?? "muted"}>{e.tag}</Chip> : null}
              </div>
            ))}
          </div>
        </div>
      </AppSurface>
    </div>
  );
}
