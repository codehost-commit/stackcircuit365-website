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
    <div className="border border-black/10 bg-white px-5 py-4">
      <div className="font-mono text-[28px] leading-none text-ink">{value}</div>
      <div className="mt-2 text-[11px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

/** Browser window bar with square window controls + address (matches the mock). */
export function WindowBar({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-black/10 bg-[#f1f0ec] px-3 py-2">
      <span className="flex gap-1.5">
        <span className="h-2.5 w-2.5 bg-[#e5534b]" />
        <span className="h-2.5 w-2.5 bg-[#e3b341]" />
        <span className="h-2.5 w-2.5 bg-[#3fb950]" />
      </span>
      <span className="flex-1 truncate border border-black/10 bg-white px-3 py-1 font-mono text-[12px] text-muted">
        {path}
      </span>
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

/** The white app surface with a window bar + header, matching the previews. */
export function AppSurface({
  path,
  title,
  status,
  children
}: {
  path: string;
  title: string;
  status: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-line bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)]">
      <WindowBar path={path} />
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <h1 className="font-mono text-[15px] text-ink">{title}</h1>
        <StatusPill status={status} />
      </div>
      {children}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}
