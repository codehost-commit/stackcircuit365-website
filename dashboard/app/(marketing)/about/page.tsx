import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "StackCircuit365 is a release safety circuit for small teams on GitHub and Vercel. Built by Rahul Awasthi and Pritam Avuthu."
};

const founders = [
  {
    img: "/founders/founder-1.jpeg",
    name: "Rahul Awasthi",
    role: "Lead Developer and Architect // Co-founder",
    bio: "Rahul designs and builds the detection and recovery engine at the core of StackCircuit365. He cares most about the parts a user never sees: the policy checks that keep an automated rollback from ever doing the wrong thing."
  },
  {
    img: "/founders/founder-2.jpeg",
    name: "Pritam Avuthu",
    role: "Lead Product Designer // Co-founder",
    bio: "Pritam shapes how StackCircuit365 looks and reads. His work turns a tense production incident into a page you can understand in seconds, so a recovery feels controlled instead of frantic."
  }
];

const timeline = [
  {
    date: "Sep 2, 2026",
    label: "Prerelease 0.5.0",
    body: "The first prerelease ships on npm for early design partners."
  },
  {
    date: "Sep 4, 2026",
    label: "Public launch",
    body: "StackCircuit365 opens to developers at 6:00 PM CT."
  }
];

export default function About() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-[12px] uppercase tracking-widest text-signal">
            About
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            A tool we built because production kept breaking on us.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            StackCircuit365 is a free-forever release safety tool for developers
            on GitHub, Vercel, Next.js, and TypeScript. It catches a
            customer-facing problem caused by a new deploy, points at the release
            responsible, and restores the last verified healthy version when that
            is safe to do.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] text-signal">/ 01</span>
              <span className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="font-mono text-[12px] uppercase tracking-widest text-muted">
                Why we made it
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
              The bug was never the hard part.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
            <p>
              StackCircuit365 started with a problem the two of us kept running
              into. We would ship a change, everything looked fine, and then a
              customer would tell us that something was broken in production. The
              fix was usually simple once we found it. Finding it was the hard
              part, and it cost us sleep.
            </p>
            <p>
              We wanted a tool that noticed the break before a customer did,
              pointed at the release that caused it, and put the last good
              version back while we worked out the real fix. Nothing we found did
              exactly that for a small team on GitHub and Vercel, so we built it
              ourselves.
            </p>
            <p>
              The name is a promise. Every release runs through a circuit that
              can trip when something goes wrong, all day and all night, so a bad
              deploy does not have to become a bad night.
            </p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-signal">/ 02</span>
            <span className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="font-mono text-[12px] uppercase tracking-widest text-muted">
              The founders
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Two builders, one narrow mission.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            {founders.map((f) => (
              <div key={f.name} className="bg-card p-8">
                <div className="w-full max-w-[260px] border border-line bg-paper">
                  <img
                    src={f.img}
                    alt={f.name}
                    width={520}
                    height={650}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 text-2xl font-medium text-ink">{f.name}</h3>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-widest text-muted">
                  {f.role}
                </p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  {f.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-signal">/ 03</span>
            <span className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="font-mono text-[12px] uppercase tracking-widest text-muted">
              Milestones
            </span>
          </div>
          <div className="mt-10 border-t border-line">
            {timeline.map((t) => (
              <div
                key={t.label}
                className="grid grid-cols-1 gap-3 border-b border-line py-7 md:grid-cols-[12rem_1fr]"
              >
                <span className="font-mono text-[13px] uppercase tracking-widest text-ink">
                  {t.date}
                </span>
                <div className="max-w-2xl">
                  <p className="text-lg font-medium text-ink">{t.label}</p>
                  <p className="mt-1 text-base leading-relaxed text-muted">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-2xl font-medium tracking-tight text-paper">
            Every release has a safety circuit.
          </p>
          <Link
            href="/#access"
            className="w-fit bg-paper px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-ink"
          >
            Protect my app
          </Link>
        </div>
      </section>
    </div>
  );
}
