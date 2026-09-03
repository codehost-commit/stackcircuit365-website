import Link from "next/link";
import { getProject, listAlerts } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { AppSurface, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Alerts({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const alerts = await listAlerts(project.id);

  return (
    <AppSurface path={`dashboard.stackcircuit.dev/p/${project.id}/alerts`} title={project.name} status={project.status}>
      <div className="p-5">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          Alerts sent · email + Slack
        </div>
        <div className="border border-line">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-line2 px-3.5 py-3 last:border-0"
            >
              <span className="w-24 shrink-0 font-mono text-[11px] text-muted">{a.at}</span>
              <Chip tone={a.channel === "email" ? "muted" : "amber"}>{a.channel}</Chip>
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink/85">{a.subject}</span>
              {a.incidentId ? (
                <Link
                  href={`/p/${project.id}/incidents/${a.incidentId}`}
                  className="font-mono text-[11px] text-signal hover:underline"
                >
                  {a.incidentId} →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AppSurface>
  );
}
