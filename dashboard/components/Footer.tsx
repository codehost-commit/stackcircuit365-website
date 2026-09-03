import Link from "next/link";
import Logo from "./Logo";

type LinkItem = { label: string; href: string; external?: boolean };

const columns: { title: string; links: LinkItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "For Developers", href: "/for-developers" },
      { label: "For Beginners", href: "/for-beginners" },
      { label: "Recovery modes", href: "/#modes" },
      { label: "Early access", href: "/#access" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      {
        label: "npm package",
        href: "https://www.npmjs.com/package/stackcircuit365",
        external: true
      },
      {
        label: "GitHub",
        href: "https://github.com/codehost-commit/stackcircuit365",
        external: true
      }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal#terms" },
      { label: "Privacy", href: "/legal#privacy" },
      { label: "Attributions", href: "/legal#attributions" }
    ]
  }
];

function ColumnLink({ item }: { item: LinkItem }) {
  const cls = "font-mono text-[13px] text-muted";
  if (item.external) {
    return (
      <a href={item.href} className={cls} target="_blank" rel="noreferrer">
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {item.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              A release safety circuit for small teams shipping GitHub and
              Vercel apps. Free forever for developers.
            </p>
            <p className="mt-5 font-mono text-xs text-muted">v0.5.0 prerelease</p>
            <p className="mt-1 font-mono text-xs text-muted">stackcircuit.dev</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink">
                {col.title}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {col.links.map((item) => (
                  <ColumnLink key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line2 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-muted">
            Copyright 2026 StackCircuit365. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted">
            Built by Rahul Awasthi and Pritam Avuthu.
          </p>
        </div>
      </div>
    </footer>
  );
}
