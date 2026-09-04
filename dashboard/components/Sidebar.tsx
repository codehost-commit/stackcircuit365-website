"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { STATUS_META, type IssueStatus } from "@/lib/types";

const NAV = [
  { key: "home", label: "Home", seg: "" },
  { key: "alerts", label: "Alerts", seg: "alerts" },
  { key: "inc", label: "Inc", seg: "incidents" },
  { key: "deploys", label: "Deploys", seg: "deploys" },
  { key: "policy", label: "Policy", seg: "policy" }
];

function NavIcon({ seg, active }: { seg: string; active: boolean }) {
  const c = active ? "#f7f7f4" : "rgba(247,247,244,0.55)";
  const common = { fill: "none", stroke: c, strokeWidth: 1.6 } as const;
  switch (seg) {
    case "":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" {...common}>
          <path d="M2.5 8 9 2.5 15.5 8M4 7v8h10V7" />
        </svg>
      );
    case "alerts":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" {...common}>
          <path d="M4 7a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S4 11 4 7ZM7 15a2 2 0 0 0 4 0" />
        </svg>
      );
    case "incidents":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" {...common}>
          <path d="M9 2.5 16 15H2L9 2.5ZM9 7v4M9 13h.01" />
        </svg>
      );
    case "deploys":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" {...common}>
          <path d="M2.5 5.5 9 2l6.5 3.5v7L9 16l-6.5-3.5v-7ZM2.5 5.5 9 9l6.5-3.5M9 9v7" />
        </svg>
      );
    case "policy":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" {...common}>
          <path d="M9 2.5 15 5v4c0 3.5-2.6 5.7-6 6.5C5.6 14.7 3 12.5 3 9V5l6-2.5ZM6.5 9l1.8 1.8L12 7" />
        </svg>
      );
    default:
      return <span className="h-3.5 w-3.5 border" style={{ borderColor: c }} />;
  }
}

export default function Sidebar({
  projectId,
  status,
  userName
}: {
  projectId: string;
  status: IssueStatus;
  userName?: string;
}) {
  const pathname = usePathname();
  const base = `/dashboard/p/${projectId}`;
  const meta = STATUS_META[status];
  const initial = (userName ?? "?").trim().charAt(0).toUpperCase() || "?";

  const isActive = (seg: string) => {
    if (seg === "") return pathname === base;
    return pathname.startsWith(`${base}/${seg}`);
  };

  return (
    <nav className="sticky top-0 flex h-screen w-[84px] shrink-0 flex-col items-stretch gap-1 self-start bg-ink px-2.5 py-4">
      {/* Brand mark */}
      <Link href={base} className="mx-auto mb-3 flex h-9 w-9 items-center justify-center" aria-label="StackCircuit365 home">
        <svg width="26" height="26" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="20" height="20" stroke="#f7f7f4" strokeWidth="1.5" />
          <path d="M1 11 H7 M15 11 H21 M11 1 V6 M11 16 V21" stroke="#f7f7f4" strokeWidth="1.5" />
          <rect x="7.5" y="7.5" width="7" height="7" fill="#0f7a3d" />
        </svg>
      </Link>

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
            className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
              active ? "bg-paper/[0.10]" : "hover:bg-paper/[0.05]"
            }`}
          >
            <NavIcon seg={item.seg} active={active} />
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

      {/* Account + sign out */}
      <div className="mt-auto flex flex-col items-center gap-2 pt-3">
        <span
          className="flex h-8 w-8 items-center justify-center bg-paper/15 font-mono text-[12px] text-paper"
          title={userName}
        >
          {initial}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/dashboard/login" })}
          className="flex flex-col items-center gap-1 py-1.5 text-paper/45 hover:text-paper"
          aria-label="Sign out"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 3H4v12h3M11 12l3-3-3-3M14 9H7" />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-wider">Out</span>
        </button>
      </div>
    </nav>
  );
}
