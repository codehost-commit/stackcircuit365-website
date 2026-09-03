import { DEMO_MODE } from "@/lib/config";
import LoginButtons from "@/components/LoginButtons";

export const dynamic = "force-dynamic";

export default function Login() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-sm border border-line bg-white">
        <div className="flex items-center gap-2.5 border-b border-line2 px-5 py-4">
          <span className="inline-flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="20" height="20" stroke="#0b0c0e" strokeWidth="1.5" />
              <path d="M1 11 H7 M15 11 H21 M11 1 V6 M11 16 V21" stroke="#0b0c0e" strokeWidth="1.5" />
              <rect x="7.5" y="7.5" width="7" height="7" fill="#0f7a3d" />
            </svg>
            <span className="font-mono text-[15px] font-semibold tracking-tight text-ink">
              StackCircuit<span className="text-signal">365</span>
            </span>
          </span>
        </div>
        <div className="px-5 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Sign in</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Use the GitHub account that owns your repositories. Then connect a project with the
            key from your StackCircuit365 agent.
          </p>
          <div className="mt-5">
            <LoginButtons demo={DEMO_MODE} />
          </div>
          <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted">
            The dashboard never stores your GitHub password. Sign-in is handled by GitHub OAuth.
          </p>
        </div>
      </div>
    </div>
  );
}
