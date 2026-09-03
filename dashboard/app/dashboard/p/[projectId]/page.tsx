import Link from "next/link";
import { getProject, getOverview, listIncidents } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { AppSurface, Stat, Chip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { projectId: string } }) {
  const user = await getSessionUser();
  const project = user ? await getProject(user.id, params.projectId) : null;
  if (!project) return null;
  const [overview, incidents] = await Promise.all([
    getOverview(project.id),
    listIncidents(project.id)
  ]);
  const open = incidents.find((i) => i.needsApproval);
  const latest = incidents[0];

  return (
    <AppSurface path={`stackcircuit.dev/dashboard/p/${project.id}`} title={project.name} status={project.status}>
      <div className="flex items-center gap-3 border-b border-black/10 bg-[#f3faf5] px-5 py-3">
        <span className="h-4 w-4 shrink-0 bg-signal" />
        <span className="font-mono text-[12px] text-ink">
          StackCircuit365 checked {project.productionUrl.replace(/^https?:\/\//, "")}{" "}
          {overview.checksToday} times today · last check {overview.lastCheckAt}.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        <Stat value={String(overview.deploysWatched)} label="deploys watched" />
        <Stat value={String(overview.incidentsContained)} label="incidents contained" />
        <Stat value={`${overview.healthyToday}%`} label="healthy today" />
        <Stat value={String(overview.versionsSaved)} label="versions saved" />
      </div>

      {open ? (
        <div className="mx-5 mb-5 border border-alert/40 bg-[#fdf3f1] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] text-ink">{open.id} needs your review</span>
            <Chip tone="red">action required</Chip>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {open.kind} · confidence {Math.round(open.confidence * 100)}%. StackCircuit365 held automation and is waiting on you.
          </p>
          <Link
            href={`/dashboard/p/${project.id}/incidents/${open.id}`}
            className="mt-3 inline-block bg-ink px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-paper"
          >
            Review incident →
          </Link>
        </div>
      ) : (
        <div className="mx-5 mb-5 flex items-center gap-3 border border-line bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-signal">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5l3 3 7-7.5" stroke="#fff" strokeWidth="2" />
            </svg>
          </span>
          <div>
            <p className="text-[15px] font-medium leading-tight text-ink">Production is healthy.</p>
            <p className="font-mono text-[12px] text-muted">
              Last known-good version <span className="text-ink">{project.knownGoodId}</span> is saved and locked.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-black/10 px-5 py-3">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          Recent activity
        </div>
        <div className="border border-line">
          {incidents.slice(0, 4).map((i) => (
            <Link
              key={i.id}
              href={`/dashboard/p/${project.id}/incidents/${i.id}`}
              className="flex items-center justify-between border-b border-line2 px-3.5 py-2.5 last:border-0 hover:bg-paper"
            >
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-[12px] text-ink">{i.id}</span>
                <span className="text-[12px] text-muted">{i.kind}</span>
              </span>
              <Chip tone={i.status === "recovered" ? "green" : i.needsApproval ? "red" : "muted"}>
                {i.status}
              </Chip>
            </Link>
          ))}
        </div>
      </div>
    </AppSurface>
  );
}
