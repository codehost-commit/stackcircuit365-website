import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Terms of Service, Privacy Policy, and Attributions for StackCircuit365."
};

const nav = [
  { href: "#terms", label: "Terms of Service" },
  { href: "#privacy", label: "Privacy Policy" },
  { href: "#attributions", label: "Attributions" }
];

function Clause({
  n,
  title,
  children
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line2 py-7">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] text-signal">{n}</span>
        <h3 className="text-lg font-medium text-ink">{title}</h3>
      </div>
      <div className="mt-3 max-w-2xl space-y-3 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </div>
  );
}

export default function Legal() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono text-[12px] uppercase tracking-widest text-signal">
            Legal
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Terms, privacy, and attributions.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Effective September 2, 2026. StackCircuit365 is prerelease software.
            These terms and this policy cover the current 0.5.0 prerelease and
            will be updated as the product reaches its public launch. Questions
            can go to hello@stackcircuit.dev.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[16rem_1fr]">
        {/* Side nav */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            On this page
          </p>
          <nav className="mt-4 flex flex-col gap-3 border-l border-line pl-4">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-mono text-[13px] text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="max-w-3xl">
          {/* TERMS */}
          <section id="terms" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Terms of Service
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              By installing the stackcircuit365 package, connecting it to your
              GitHub and Vercel projects, or using the software in any form, you
              agree to the terms below.
            </p>

            <Clause n="1.0" title="The software">
              <p>
                StackCircuit365 is free, open-source software published on npm as{" "}
                <span className="font-mono text-ink">stackcircuit365</span>. You
                run it yourself, on your own infrastructure. It monitors
                deployments from GitHub to Vercel, detects release regressions in
                production, recommends or performs rollbacks under rules you
                configure, and produces incident reports. It is offered under the
                MIT license and has no paid tiers.
              </p>
            </Clause>

            <Clause n="1.5" title="Open source and license">
              <p>
                The source code is released under the MIT license and is
                available on npm and GitHub. You are free to use, modify, and
                self-host it, including for commercial projects, subject to the
                license text that ships with the package. The MIT license governs
                the code itself; the operational terms on this page apply to how
                you run it against production systems.
              </p>
            </Clause>

            <Clause n="2.0" title="Your responsibilities">
              <p>
                You are responsible for the code you deploy, for the recovery
                mode you select, and for reviewing any rollback recommendation
                before you approve it. Auto-Recover is off by default and takes
                effect only after you enable it and accept the risks described in
                the dashboard.
              </p>
            </Clause>

            <Clause n="3.0" title="Access and permissions">
              <p>
                StackCircuit365 requests the minimum GitHub permissions needed to
                do its job. It starts with read access to repository metadata and
                contents. Any write permission, such as creating issues or draft
                pull requests, is opt in and can be revoked at any time from
                GitHub.
              </p>
            </Clause>

            <Clause n="4.0" title="Automated actions">
              <p>
                A deterministic policy engine governs every rollback and every
                write. The service will not automatically touch database
                migrations, authentication, authorization, billing, secrets,
                environment variables, or any change it cannot verify as safe. In
                those cases it stops and alerts you.
              </p>
            </Clause>

            <Clause n="5.0" title="Prerelease software, provided as is">
              <p>
                The prerelease is provided without warranties of any kind. We do
                our best to make recovery safe and correct, but you should not
                rely on it as the only safeguard for a production system.
                StackCircuit365 is not liable for indirect or consequential
                damages arising from use of the prerelease.
              </p>
            </Clause>

            <Clause n="6.0" title="Free forever, with fair use">
              <p>
                StackCircuit365 is free to use and has no paid tiers. Core
                release monitoring, incident reports, rollback recommendations,
                and policy-controlled recovery stay free. Reasonable fair-use
                limits keep it sustainable, such as one repository, one Vercel
                project, one production URL, standard health checks, a limited
                incident history, and a capped number of repair attempts. These
                limits may be adjusted over time, but the product stays free.
              </p>
            </Clause>

            <Clause n="7.0" title="Changes and termination">
              <p>
                You can disconnect StackCircuit365 from GitHub and Vercel at any
                time. We may update these terms as the product matures and will
                post the effective date at the top of this page.
              </p>
            </Clause>
          </section>

          {/* PRIVACY */}
          <section id="privacy" className="mt-20 scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Privacy Policy
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              StackCircuit365 runs on your infrastructure, not ours. When you
              self-host the open-source package, we never receive your
              deployments, health data, or secrets. We do not sell data, and
              there is nothing for us to sell.
            </p>

            <Clause n="1.0" title="Self-hosted by default">
              <p>
                You run the{" "}
                <span className="font-mono text-ink">stackcircuit365</span>{" "}
                package yourself. Everything it works with, including Vercel
                deployment events, GitHub commit metadata, health-check results,
                your alert settings, and any tokens you provide, stays on your
                own machine or server. It is sent only to the services you point
                it at, using credentials you control. The authors of
                StackCircuit365 receive none of it.
              </p>
            </Clause>

            <Clause n="2.0" title="What the software touches">
              <p>
                To do its job on your infrastructure it reads deployment events
                from Vercel, commit metadata and changed file names from GitHub
                with read-only access by default, and health responses from your
                production URL. It never clones your repository or reads source
                beyond the changed files needed to explain an incident. Webhook
                events are signature verified and stored in your own datastore so
                every automated action can be traced.
              </p>
            </Clause>

            <Clause n="3.0" title="This website">
              <p>
                stackcircuit.dev is a static marketing site hosted on GitHub
                Pages. It has no accounts and no login, and it sets no tracking
                cookies. If you email us at hello@stackcircuit.dev, we keep that
                message so we can reply.
              </p>
            </Clause>

            <Clause n="4.0" title="Third parties and your credentials">
              <p>
                StackCircuit365 talks to the services you connect, such as GitHub
                and Vercel, and optionally Slack or an email provider like
                Resend, using tokens you supply and store yourself. Those
                services process data under their own terms. When you self-host,
                we are not a processor of your production data.
              </p>
            </Clause>

            <Clause n="5.0" title="The hosted dashboard (optional)">
              <p>
                The hosted dashboard at dashboard.stackcircuit.dev is an optional
                control panel. If you connect a project to it, we store
                non-secret metadata — deployment events, incident timelines,
                health results, your alert email, and the recovery decisions you
                make — so you can review and approve recovery from anywhere, and
                so we can send your alert emails. You sign in with GitHub.
              </p>
              <p>
                We never receive your Vercel or GitHub tokens. When you approve a
                rollback, the dashboard records the decision and your own
                self-hosted agent performs it — the credentials that can change
                production stay on your infrastructure. Using the dashboard is
                optional; the open-source agent runs without it.
              </p>
            </Clause>

            <Clause n="6.0" title="Security">
              <p>
                Secrets and credentials never leave your infrastructure. Every
                rollback and write is gated by the deterministic policy engine
                and the recovery mode you choose, and read-only monitoring needs
                no write access at all.
              </p>
            </Clause>
          </section>

          {/* ATTRIBUTIONS */}
          <section id="attributions" className="mt-20 scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Attributions
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              StackCircuit365 is designed and built by its two co-founders.
            </p>

            <div className="mt-6 border border-line">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-b border-line2 p-6 sm:border-b-0 sm:border-r">
                  <p className="text-lg font-medium text-ink">Rahul Awasthi</p>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-widest text-muted">
                    Lead Developer and Architect
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Detection and recovery engine, policy engine, and platform
                    architecture.
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-lg font-medium text-ink">Pritam Avuthu</p>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-widest text-muted">
                    Lead Product Designer
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Product design, incident reporting experience, and the
                    StackCircuit365 brand.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              StackCircuit365 is built with Next.js, TypeScript, and Tailwind
              CSS. Product and company names referenced on this site, including
              GitHub and Vercel, are trademarks of their respective owners and
              are used here for identification only.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
