import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Developers",
  description:
    "How StackCircuit365 works under the hood: from the Vercel webhook to a verified rollback, with the policy engine in control."
};

const steps = [
  {
    n: "01",
    title: "Ingest the deploy event",
    body: "Vercel fires deployment.succeeded. We verify the signature, persist the event, and resolve it to a GitHub SHA.",
    code: ["POST /webhooks/vercel  200", "dpl_7c33a  ->  e9f14a2"]
  },
  {
    n: "02",
    title: "Tighten the health window",
    body: "For ten to fifteen minutes after promotion, polls drop to every few seconds against your URL and optional /health.",
    code: ["GET /api/health 200 210ms", "GET /api/health 500 3.2s  x4"]
  },
  {
    n: "03",
    title: "Correlate and score",
    body: "Failure onset is diffed against deploy time and checked against dependency status before any verdict is reached.",
    code: ["onset delta 1m54s", "deps ok   confidence 0.93"]
  },
  {
    n: "04",
    title: "Recover to known-good",
    body: "The last verified deployment is the target. Your policy decides recommend or execute, then we re-poll to confirm.",
    code: ["rollback -> dpl_6b0f9", "verify 10/10  70s"]
  },
  {
    n: "05",
    title: "Emit a replayable record",
    body: "A signed incident timeline with the commit, deploy, checks, cause, action, and recovery, ready to audit.",
    code: ["incident inc_20260904", "status closed  signed"]
  }
];

export default function ForDevelopers() {
  return (
    <div>
      {/* Dark hero */}
      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-[12px] uppercase tracking-widest text-paper/50">
            For developers
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-5xl">
            Under the hood.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
            From the Vercel webhook to a verified rollback, here is the exact path
            a release runs through. A deterministic policy engine controls every
            write. The AI only reads evidence and drafts the report.
          </p>
          <div className="mt-8 border border-white/15 bg-[#101216] p-5 font-mono text-[12px] leading-relaxed text-paper/80 sm:text-[13px]">
            <div className="text-paper/45">$ npm i -g stackcircuit365</div>
            <div className="mt-1">
              <span className="text-paper/45">$</span> stackcircuit watch --repo you/app --prod
              https://app.example.dev
            </div>
            <div className="mt-1" style={{ color: "#5bd08a" }}>
              baseline healthy // known-good locked: dpl_9f21c
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="border border-line bg-paper">
            {steps.map((s) => (
              <div
                key={s.n}
                className="grid grid-cols-1 gap-5 border-b border-line2 p-6 last:border-b-0 md:grid-cols-[3rem_1fr_1.05fr] md:items-start md:gap-8"
              >
                <span className="font-mono text-lg text-ink">{s.n}</span>
                <div>
                  <h3 className="text-lg font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
                    {s.body}
                  </p>
                </div>
                <div className="overflow-x-auto border border-line bg-card p-4 font-mono text-[12px] leading-relaxed text-ink">
                  {s.code.map((line, i) => (
                    <div key={i} className={i === 0 ? "" : "mt-1 text-muted"}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-muted">
              New to shipping to production?{" "}
              <Link href="/for-beginners" className="font-mono text-ink underline">
                See the simple version.
              </Link>
            </p>
            <a
              href="https://www.npmjs.com/package/stackcircuit365"
              target="_blank"
              rel="noreferrer"
              className="w-fit bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper"
            >
              Install from npm
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
