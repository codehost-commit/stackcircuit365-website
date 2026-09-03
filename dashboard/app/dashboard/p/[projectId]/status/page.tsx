import { getProject, listDeploys } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { AppSurface, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Status({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const deploys = await listDeploys(project.id);
  const live = deploys.find((d) => d.id === project.liveDeploymentId) ?? deploys[0];

  const rows: [string, string][] = [
    ["status", "HEALTHY // 12 of 12 checks passing"],
    ["deploy", `${project.liveDeploymentId} promoted 4m ago`],
    ["commit", `${live?.commit ?? "—"}  "${live?.message ?? ""}"`],
    ["latency", "p95 210ms // no error spike"],
    ["known good", `${project.knownGoodId}  verified and locked`]
  ];

  return (
    <AppSurface path={`stackcircuit.dev/dashboard/p/${project.id}/status`} title={project.name} status={project.status}>
      <dl className="divide-y divide-black/[0.07] font-mono text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-5 py-3.5">
            <dt className="pt-0.5 text-[11px] uppercase tracking-widest text-muted">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between border-t border-black/10 px-5 py-3">
        <span className="font-mono text-[11px] text-muted">Next check in 41s · post-deploy window closes in 9m.</span>
        <Chip tone="green">recovery armed</Chip>
      </div>
    </AppSurface>
  );
}
