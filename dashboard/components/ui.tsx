import type { ReactNode } from "react";

export function Chip({
  children,
  tone = "green"
}: {
  children: ReactNode;
  tone?: "green" | "amber" | "red" | "muted";
}) {
  const map = {
    green: "bg-[#e6f2ea] text-signal",
    amber: "bg-[#fbf1de] text-amber",
    red: "bg-[#fbe9e7] text-alert",
    muted: "bg-[#eeeee8] text-muted"
  } as const;
  return (
    <span className={`px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-line bg-white px-5 py-4">
      <div className="font-mono text-[28px] leading-none text-ink">{value}</div>
      <div className="mt-2 text-[11px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const good = ["healthy", "recovered", "resolved", "ready"].includes(status);
  const bad = ["critical", "down", "error", "failed"].includes(status);
  const color = good ? "text-signal" : bad ? "text-alert" : "text-amber";
  const dot = good ? "bg-signal" : bad ? "bg-alert" : "bg-warn";
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 ${dot}`} />
      <span className={`font-mono text-[13px] ${color}`}>{cap(status)}</span>
    </span>
  );
}

/**
 * A real page shell: a sticky header with the project name + a status pill, and
 * a centered content column. No fake browser chrome — this is the app itself.
 */
export function Shell({
  title,
  subtitle,
  status,
  children
}: {
  title: string;
  subtitle?: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-3.5 sm:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-0.5 truncate font-mono text-[12px] text-muted">{subtitle}</p>
          ) : null}
        </div>
        {status ? <StatusPill status={status} /> : null}
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}

/** A titled section block used across pages. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">{title}</h2>
      {children}
    </section>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}
