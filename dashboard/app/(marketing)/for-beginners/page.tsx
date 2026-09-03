import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Beginners",
  description:
    "The plain-language version of what StackCircuit365 does for your site, with no jargon."
};

const steps = [
  {
    n: "1",
    title: "You publish an update",
    body: "You change your site and it goes live, the same way you always ship."
  },
  {
    n: "2",
    title: "We keep watch",
    body: "Right after, StackCircuit365 checks your live site again and again to make sure real visitors can still use it."
  },
  {
    n: "3",
    title: "We catch a break fast",
    body: "If the site starts failing, we notice in seconds and work out that the new update was the cause."
  },
  {
    n: "4",
    title: "We put the good version back",
    body: "With your okay, we switch back to the last version that worked, check it is fine, and send you a short report."
  }
];

export default function ForBeginners() {
  return (
    <div>
      {/* Light hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-[12px] uppercase tracking-widest text-signal">
            For beginners
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            The simple version.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            No jargon. If you have a website that goes live on the internet,
            StackCircuit365 quietly watches it and steps in when a new update
            breaks something. Here is the whole idea in four steps.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-4 md:gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="grid grid-cols-[3.5rem_1fr] items-start gap-6 border border-line bg-paper p-7 md:grid-cols-[5rem_1fr] md:p-9"
              >
                <span className="font-mono text-4xl leading-none text-signal md:text-5xl">
                  {s.n}
                </span>
                <div className="max-w-2xl">
                  <h3 className="text-xl font-medium text-ink md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted md:text-lg">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-muted">
              Comfortable with deploys and rollbacks?{" "}
              <Link href="/for-developers" className="font-mono text-ink underline">
                See the developer version.
              </Link>
            </p>
            <Link
              href="/#access"
              className="w-fit bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper"
            >
              Protect my app
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
