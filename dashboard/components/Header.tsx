"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" }
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="StackCircuit365 home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <div className="flex items-center gap-5 sm:gap-8">
          <nav className="hidden items-center gap-8 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-[13px] uppercase tracking-widest ${
                  isActive(item.href)
                    ? "border-b-2 border-ink pb-4 pt-5 text-ink"
                    : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/dashboard"
              className="font-mono text-[13px] uppercase tracking-widest text-muted"
            >
              Dashboard
            </a>
          </nav>
          <a
            href="https://www.npmjs.com/package/stackcircuit365"
            target="_blank"
            rel="noreferrer"
            className="bg-ink px-3.5 py-2 font-mono text-[13px] uppercase tracking-widest text-paper"
          >
            npm
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center border border-line sm:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-line2 bg-paper sm:hidden">
          <div className="mx-auto max-w-6xl px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block border-b border-line2 py-3.5 font-mono text-[13px] uppercase tracking-widest last:border-b-0 ${
                  isActive(item.href) ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/dashboard"
              className="block border-b border-line2 py-3.5 font-mono text-[13px] uppercase tracking-widest text-muted last:border-b-0"
            >
              Dashboard
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
