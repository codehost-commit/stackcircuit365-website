import Link from "next/link";

/* Browser window bar with square window controls (round corners are off by
   design) and an address pill. */
function WindowBar({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/10 bg-[#f1f0ec] px-2.5 py-1.5">
      <span className="flex gap-1">
        <span className="h-2 w-2 bg-[#e5534b]" aria-hidden="true" />
        <span className="h-2 w-2 bg-[#e3b341]" aria-hidden="true" />
        <span className="h-2 w-2 bg-[#3fb950]" aria-hidden="true" />
      </span>
      <span className="ml-1.5 flex-1 truncate border border-black/10 bg-white px-2 py-[3px] font-mono text-[9px] text-muted">
        {path}
      </span>
    </div>
  );
}

/* The dark nav rail, with small labelled items like a real product. */
function Rail({
  items,
  active = 0
}: {
  items: string[];
  active?: number;
}) {
  return (
    <div className="flex w-14 shrink-0 flex-col items-stretch gap-1 bg-ink px-1.5 py-2.5 sm:w-[62px]">
      <div className="mx-auto mb-1 h-4 w-4 bg-signal" aria-hidden="true" />
      {items.map((label, i) => (
        <div
          key={label}
          className={`flex flex-col items-center gap-0.5 py-1 ${
            i === active ? "bg-paper/[0.08]" : ""
          }`}
        >
          <span
            className={`h-2.5 w-2.5 border ${
              i === active ? "border-paper/70 bg-paper/25" : "border-paper/25"
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-mono text-[7px] uppercase tracking-wide ${
              i === active ? "text-paper/80" : "text-paper/40"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Tabs({ tabs, active = 0 }: { tabs: string[]; active?: number }) {
  return (
    <div className="flex items-center gap-3.5 overflow-hidden border-b border-black/10 px-3.5 py-2 font-mono text-[10px]">
      {tabs.map((t, i) => (
        <span
          key={t}
          className={
            i === active
              ? "-mb-[9px] border-b-2 border-ink pb-[7px] text-ink"
              : "text-muted"
          }
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-black/10 bg-white px-3 py-2.5">
      <div className="font-mono text-[19px] leading-none text-ink">{value}</div>
      <div className="mt-1.5 text-[9px] uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}

function Chip({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: "green" | "amber" | "red";
}) {
  const map = {
    green: "bg-[#e6f2ea] text-signal",
    amber: "bg-[#fbf1de] text-amber",
    red: "bg-[#fbe9e7] text-alert"
  } as const;
  return (
    <span
      className={`px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${map[tone]}`}
    >
      {children}
    </span>
  );
}

/* Developer screenshot: a fuller StackCircuit365 incident dashboard. */
function DevScreen() {
  return (
    <div className="sc-screen bg-white text-ink">
      <WindowBar path="app.stackcircuit.dev/incidents/inc_7c33a" />
      <div className="flex">
        <Rail items={["Status", "Inc", "Deploys", "Policy"]} active={1} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-black/10 px-3.5 py-2">
            <span className="truncate font-mono text-[10.5px] text-ink">
              production // stackcircuit.dev
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
              <span className="font-mono text-[10px] text-signal">Recovered</span>
            </span>
          </div>
          <Tabs tabs={["Overview", "Timeline", "Evidence"]} active={0} />
          <div className="grid grid-cols-2 gap-2 px-3.5 pb-1 pt-3">
            <Stat value="14" label="deploys watched" />
            <Stat value="3" label="incidents contained" />
          </div>
          <div className="space-y-2.5 p-3.5">
            <div className="border border-black/10 bg-[#faf9f6] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink">inc_7c33a</span>
                <Chip tone="amber">release regression</Chip>
              </div>
              <div className="mt-1.5 font-mono text-[10px] leading-relaxed text-muted">
                dpl_7c33a · commit a1b2c3d · confidence 93%
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-2.5">
                <span className="font-mono text-[10px] text-ink">
                  Auto-rollback → dpl_9f21c
                </span>
                <Chip tone="green">recovered</Chip>
              </div>
            </div>
            <div className="border border-black/10">
              {[
                ["14:03:47", "health 500 × 4 · p95 3.2s", "detected", "red"],
                ["14:04:05", "attributed to dpl_7c33a", "commit a1b2c3d", "amber"],
                ["14:05:38", "rollback verified", "dpl_9f21c", "green"]
              ].map(([t, msg, tag, tone]) => (
                <div
                  key={t as string}
                  className="flex items-center justify-between gap-2 border-b border-black/[0.07] px-2.5 py-1.5 font-mono text-[9.5px] last:border-0"
                >
                  <span className="text-muted">{t}</span>
                  <span className="flex-1 truncate text-ink/80">{msg}</span>
                  <Chip tone={tone as "green" | "amber" | "red"}>{tag}</Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Beginner screenshot: a fuller, friendly status view. */
function BeginnerScreen() {
  return (
    <div className="sc-screen bg-white text-ink">
      <WindowBar path="stackcircuit.dev/your-site" />
      <div className="flex">
        <Rail items={["Home", "Alerts"]} active={0} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-black/10 px-3.5 py-2">
            <span className="font-mono text-[10.5px] text-ink">Your site</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
              <span className="font-mono text-[10px] text-signal">Healthy</span>
            </span>
          </div>
          <div className="flex items-center gap-2 border-b border-black/10 bg-[#f3faf5] px-3.5 py-2">
            <span className="h-3.5 w-3.5 shrink-0 bg-signal" aria-hidden="true" />
            <span className="font-mono text-[10px] leading-tight text-ink">
              StackCircuit365 checked your site 12 times today.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 px-3.5 pb-1 pt-3">
            <Stat value="100%" label="healthy today" />
            <Stat value="4" label="versions saved" />
          </div>
          <div className="p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-signal">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7.5" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </span>
              <div>
                <p className="text-[14px] font-medium leading-tight text-ink">
                  Your site is healthy.
                </p>
                <p className="font-mono text-[10px] text-muted">
                  Last good version saved · 4 min ago
                </p>
              </div>
            </div>
            <div className="mt-3 border border-black/10">
              {[
                ["Site is loading", "OK"],
                ["Latest version saved", "OK"],
                ["Ready to undo a bad update", "ARMED"]
              ].map(([label, tag]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-black/[0.07] px-2.5 py-1.5 text-[11px] last:border-0"
                >
                  <span className="text-ink/80">{label}</span>
                  <Chip tone="green">{tag}</Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudienceSplit() {
  return (
    <div className="audience">
      {/* Developers */}
      <Link href="/for-developers" className="audience-panel audience-dark group">
        <div className="audience-inner">
        <div className="relative z-[1] p-8 sm:p-10">
          <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
            Under the hood
          </span>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-paper sm:text-[2.6rem] sm:leading-[1.05]">
            For Developers
          </h3>
          <p className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-paper/70">
            You know a deploy from a rollback. See exactly what runs, from
            webhook to verified recovery.
          </p>
          <span className="mt-7 inline-flex items-center gap-2 border border-paper/35 px-4 py-2.5 font-mono text-[12px] uppercase tracking-widest text-paper transition-colors group-hover:border-paper/70">
            Developer walkthrough
            <span aria-hidden="true">→</span>
          </span>
        </div>
        <div className="relative z-[1] mt-auto pl-8 pr-8 sm:pl-10">
          <div className="sc-screen-wrap">
            <DevScreen />
          </div>
        </div>
        </div>
      </Link>

      {/* Beginners */}
      <Link href="/for-beginners" className="audience-panel audience-light group">
        <div className="audience-inner">
        <div className="relative z-[1] p-8 sm:p-10">
          <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
            Plain English
          </span>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.05]">
            For Beginners
          </h3>
          <p className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-muted">
            New to shipping? Here is what StackCircuit365 does for you, in plain
            English.
          </p>
          <span className="mt-7 inline-flex items-center gap-2 border border-ink/30 px-4 py-2.5 font-mono text-[12px] uppercase tracking-widest text-ink transition-colors group-hover:border-ink">
            The simple version
            <span aria-hidden="true">→</span>
          </span>
        </div>
        <div className="relative z-[1] mt-auto pl-8 pr-8 sm:pr-10">
          <div className="sc-screen-wrap">
            <BeginnerScreen />
          </div>
        </div>
        </div>
      </Link>
    </div>
  );
}
