import Link from "next/link";
import { getProject, listAlerts } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { Shell, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Alerts({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const alerts = await listAlerts(project.id);

  return (
    <Shell title={project.name} subtitle="Alerts · email + Slack" status={project.status}>
      {alerts.length ? (
        <div className="border border-line bg-white">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-line2 px-4 py-3 last:border-0"
            >
              <span className="w-24 shrink-0 font-mono text-[11px] text-muted">{a.at}</span>
              <Chip tone={a.channel === "email" ? "muted" : "amber"}>{a.channel}</Chip>
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink/85">{a.subject}</span>
              {a.incidentId ? (
                <Link
                  href={`/dashboard/p/${project.id}/incidents/${a.incidentId}`}
                  className="font-mono text-[11px] text-signal hover:underline"
                >
                  {a.incidentId} →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white px-4 py-10 text-center">
          <p className="text-[13px] text-muted">
            No alerts sent yet. When notifications are on, every alert is logged here.
          </p>
        </div>
      )}
    </Shell>
  );
}
