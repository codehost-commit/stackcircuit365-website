import { getProject, listDeploys } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { AppSurface, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Deploys({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const deploys = await listDeploys(project.id);

  return (
    <AppSurface path={`stackcircuit.dev/dashboard/p/${project.id}/deploys`} title={project.name} status={project.status}>
      <div className="p-5">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          Production deployments
        </div>
        <div className="border border-line">
          <div className="grid grid-cols-[7rem_1fr_6rem_7rem] gap-3 border-b border-line bg-paper px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span>Deploy</span><span>Commit</span><span>State</span><span></span>
          </div>
          {deploys.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-[7rem_1fr_6rem_7rem] items-center gap-3 border-b border-line2 px-3.5 py-3 last:border-0"
            >
              <span className="font-mono text-[12px] text-ink">{d.id}</span>
              <span className="min-w-0 truncate text-[13px] text-muted">
                <span className="font-mono text-[11px] text-ink">{d.commit}</span> · {d.message}
              </span>
              <Chip tone={d.state === "ready" ? "green" : d.state === "error" ? "red" : "amber"}>{d.state}</Chip>
              <span className="text-right">
                {d.knownGood ? <Chip tone="green">known-good</Chip> : <span className="font-mono text-[11px] text-muted">{d.createdAt}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppSurface>
  );
}
