import Link from "next/link";
import Countdown from "@/components/Countdown";
import IncidentTimeline from "@/components/IncidentTimeline";
import AudienceSplit from "@/components/AudienceSplit";

const modes = [
  {
    tag: "Default",
    tagColor: "text-muted",
    name: "Observe Only",
    body: "Detects incidents and writes an evidence report. It alerts you and changes nothing. This is where every account starts."
  },
  {
    tag: "Recommended",
    tagColor: "text-signal",
    name: "Approval Required",
    body: "Detects a likely regression and sends a rollback recommendation. You approve it in the dashboard, or later from Slack."
  },
  {
    tag: "Opt in",
    tagColor: "text-amber",
    name: "Auto-Recover",
    body: "Performs a rollback on its own, but only when every strict safety rule is met. Off until you turn it on, and only after real testing."
  }
];

const isNot = [
  "Not a generic uptime monitor",
  "Not a full observability platform",
  "Not a replacement for Sentry or Datadog",
  "Not an enterprise incident-management suite",
  "Not an AI coding chatbot"
];

const is = [
  "A release-recovery tool for teams that ship often",
  "Built for GitHub, Vercel, Next.js, and TypeScript",
  "Made for one to twenty engineers with no dedicated SRE",
  "Focused on the minutes right after a deploy"
];

const stats = [
  ["Under 90s", "to detect a hard outage"],
  ["Under 3 min", "to verified recovery on clear cases"],
  ["Zero", "unsafe automated actions, by design"]
];

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[12px] text-signal">{n}</span>
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      <span className="font-mono text-[12px] uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 border border-line bg-card px-3 py-1.5">
              <span className="h-2 w-2 bg-signal" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Prerelease 0.5.0 live // Sep 2, 2026
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Every release has a<br className="hidden sm:block" /> safety circuit.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              StackCircuit365 watches your GitHub to Vercel deployments. When a
              release breaks production, it works out which deploy caused it and
              brings back your last verified healthy version, but only within
              the rules you set. Free forever for developers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#access"
                className="bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper"
              >
                Protect my app
              </Link>
              <a
                href="https://www.npmjs.com/package/stackcircuit365"
                target="_blank"
                rel="noreferrer"
                className="border border-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-ink"
              >
                View on npm
              </a>
            </div>

            <div className="mt-10 max-w-md">
              <Countdown />
            </div>
          </div>

          {/* Production status panel */}
          <div className="lg:pt-2">
            <div className="border border-line bg-card">
              <div className="flex items-center justify-between border-b border-line2 px-4 py-2.5">
                <span className="font-mono text-[12px] text-ink">
                  production // stackcircuit.dev
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-signal" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
                    Healthy
                  </span>
                </div>
              </div>
              <dl className="divide-y divide-line2 font-mono text-[13px]">
                {[
                  ["status", "HEALTHY // 12 of 12 checks passing"],
                  ["deploy", "dpl_9f21c  promoted 4m ago"],
                  ["commit", 'a1b2c3d  "fix: cache-control header"'],
                  ["latency", "p95 210ms // no error spike"],
                  ["known good", "dpl_9f21c  verified and locked"]
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[7rem_1fr] gap-3 px-4 py-3"
                  >
                    <dt className="pt-0.5 text-[11px] uppercase tracking-widest text-muted">
                      {k}
                    </dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-line2 px-4 py-3">
                <span className="font-mono text-[11px] text-muted">
                  Next check in 41s. Post-deploy window closes in 9m.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience split */}
      <section id="how" className="scroll-mt-20 border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            The minute after you ship.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            That is when releases break, and when StackCircuit365 goes to work.
            Pick the walkthrough that fits how you build.
          </p>
          <div className="mt-10">
            <AudienceSplit />
          </div>
        </div>
      </section>

      {/* Recovery modes */}
      <section id="modes" className="scroll-mt-20 border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Eyebrow n="/ 01" label="Recovery modes" />
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            You decide how much it is allowed to do.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Start in Observe Only and move up as you learn to trust it. Nothing
            touches production until your policy says it can.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
            {modes.map((m) => (
              <div key={m.name} className="bg-card p-7">
                <span
                  className={`font-mono text-[11px] uppercase tracking-widest ${m.tagColor}`}
                >
                  {m.tag}
                </span>
                <h3 className="mt-4 text-xl font-medium text-ink">{m.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident demo */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Eyebrow n="/ 02" label="A worked incident" />
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Watch a real regression get contained.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            This is a simulated timeline of a bad deploy caught in Approval
            Required mode. Step through it to see what your team would receive.
          </p>

          <div className="mt-12">
            <IncidentTimeline />
          </div>
        </div>
      </section>

      {/* Is / Is not */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Eyebrow n="/ 03" label="Scope" />
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            One narrow job, done properly.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            <div className="bg-card p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-signal">
                What it is
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {is.map((t) => (
                  <li key={t} className="flex gap-3 text-base text-ink">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal"
                      aria-hidden="true"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-alert">
                What it is not
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {isNot.map((t) => (
                  <li key={t} className="flex gap-3 text-base text-muted">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-line"
                      aria-hidden="true"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety + reliability */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow n="/ 04" label="Safety first" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                The AI never decides to change production.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                A deterministic policy engine controls every rollback and every
                write. The AI reads evidence, connects a failure to a commit, and
                drafts the report a human reviews. It stops at the door of any
                database migration, auth change, billing path, secret, or
                anything it is not sure about.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                StackCircuit365 must be safe before it is impressive. That rule
                comes before every feature on the roadmap.
              </p>
            </div>

            <div className="lg:pt-16">
              <div className="border border-line">
                {stats.map(([stat, label]) => (
                  <div
                    key={stat}
                    className="border-b border-line2 px-6 py-6 last:border-b-0"
                  >
                    <div className="font-mono text-3xl text-ink">{stat}</div>
                    <div className="mt-2 text-base text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free forever */}
      <section id="access" className="scroll-mt-20 bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="font-mono text-[12px] uppercase tracking-widest text-paper/60">
                Free forever
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
                Bring StackCircuit365 to your next deploy.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">
                The public launch is Friday, September 4, 2026. StackCircuit365 is
                free, with no paid tiers. Connect one GitHub repo and one Vercel
                project, and see your production status in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.npmjs.com/package/stackcircuit365"
                target="_blank"
                rel="noreferrer"
                className="bg-paper px-5 py-4 text-center font-mono text-[13px] uppercase tracking-widest text-ink"
              >
                View the package on npm
              </a>
              <a
                href="https://github.com/codehost-commit/stackcircuit365"
                target="_blank"
                rel="noreferrer"
                className="border border-paper/40 px-5 py-4 text-center font-mono text-[13px] uppercase tracking-widest text-paper"
              >
                View the source on GitHub
              </a>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-paper/50">
                Free forever. One repo, one Vercel project, one production URL,
                standard checks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
