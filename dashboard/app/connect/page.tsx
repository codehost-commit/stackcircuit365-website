import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/config";
import ConnectForm from "@/components/ConnectForm";

export const dynamic = "force-dynamic";

export default function Connect() {
  if (DEMO_MODE) redirect("/p/prj_demo");
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-md border border-line bg-white">
        <div className="border-b border-line2 px-5 py-4">
          <span className="font-mono text-[13px] uppercase tracking-widest text-ink">Connect a project</span>
        </div>
        <div className="px-5 py-6">
          <p className="text-[13px] leading-relaxed text-muted">
            Paste the project key printed by your StackCircuit365 agent on first run
            (<span className="font-mono text-ink">stackcircuit365-serve</span>). It links this project
            to your account. Treat it like a password — it only ever goes here, never in a URL.
          </p>
          <ConnectForm />
        </div>
      </div>
    </div>
  );
}
