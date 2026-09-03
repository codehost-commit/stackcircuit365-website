"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STATUS_META, type IssueStatus } from "@/lib/types";

const NAV = [
  { key: "home", label: "Home", seg: "" },
  { key: "alerts", label: "Alerts", seg: "alerts" },
  { key: "inc", label: "Inc", seg: "incidents" },
  { key: "deploys", label: "Deploys", seg: "deploys" },
  { key: "policy", label: "Policy", seg: "policy" }
];

export default function Sidebar({
  projectId,
  status
}: {
  projectId: string;
  status: IssueStatus;
}) {
  const pathname = usePathname();
  const base = `/dashboard/p/${projectId}`;
  const meta = STATUS_META[status];

  const isActive = (seg: string) => {
    if (seg === "") return pathname === base;
    return pathname.startsWith(`${base}/${seg}`);
  };

  return (
    <nav className="flex w-[76px] shrink-0 flex-col items-stretch gap-1.5 bg-ink px-2 py-4">
      {/* Status box: color reflects issue status; hover reveals what it means. */}
      <button
        type="button"
        className="status-box relative mx-auto mb-2 flex h-11 w-11 items-center justify-center"
        style={{ background: meta.color }}
        aria-label={meta.tip}
      >
        <span className="status-tip">{meta.tip}</span>
      </button>

      {NAV.map((item) => {
        const active = isActive(item.seg);
        const href = item.seg ? `${base}/${item.seg}` : base;
        return (
          <Link
            key={item.key}
            href={href}
            className={`flex flex-col items-center gap-1 py-2 ${
              active ? "bg-paper/[0.09]" : "hover:bg-paper/[0.05]"
            }`}
          >
            <span
              className={`h-3.5 w-3.5 border ${
                active ? "border-paper/80 bg-paper/25" : "border-paper/30"
              }`}
            />
            <span
              className={`font-mono text-[9px] uppercase tracking-wider ${
                active ? "text-paper" : "text-paper/45"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
