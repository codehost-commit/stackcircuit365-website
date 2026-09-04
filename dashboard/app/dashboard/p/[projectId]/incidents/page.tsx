import Link from "next/link";
import { getProject, listIncidents } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { Shell, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Incidents({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const incidents = await listIncidents(project.id);

  return (
    <Shell title={project.name} subtitle={`Incidents · ${incidents.length}`} status={project.status}>
      {incidents.length ? (
        <div className="border border-line bg-white">
          <div className="grid grid-cols-[8rem_1fr_7rem_6rem] gap-3 border-b border-line bg-paper px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span>ID</span>
            <span>Kind</span>
            <span>Confidence</span>
            <span>Status</span>
          </div>
          {incidents.map((i) => (
            <Link
              key={i.id}
              href={`/dashboard/p/${project.id}/incidents/${i.id}`}
              className="grid grid-cols-[8rem_1fr_7rem_6rem] items-center gap-3 border-b border-line2 px-4 py-3 last:border-0 hover:bg-paper"
            >
              <span className="font-mono text-[12px] text-ink">{i.id}</span>
              <span className="truncate text-[13px] text-muted">
                {i.kind}
                {i.suspectCommit ? (
                  <span className="font-mono text-[11px] text-muted"> · {i.suspectCommit}</span>
                ) : null}
              </span>
              <span className="font-mono text-[12px] text-ink">{Math.round(i.confidence * 100)}%</span>
              <Chip tone={i.status === "recovered" ? "green" : i.needsApproval ? "red" : "muted"}>
                {i.status}
              </Chip>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white px-4 py-10 text-center">
          <p className="text-[13px] text-muted">No incidents recorded yet.</p>
        </div>
      )}
    </Shell>
  );
}
