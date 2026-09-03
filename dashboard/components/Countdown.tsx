"use client";

import { useEffect, useState } from "react";

// 6:00 PM CT on Friday, September 4, 2026. September is CDT (UTC-5).
const TARGET = new Date("2026-09-04T18:00:00-05:00").getTime();
const LABELS = ["days", "hrs", "min", "sec"];
const DEL = 42; // ms to erase one character
const TYPE = 70; // ms to type one character

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function segsFromNow(): string[] {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return [pad(d), pad(h), pad(m), pad(s)];
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function Countdown() {
  const [segs, setSegs] = useState<string[] | null>(null);
  const [active, setActive] = useState(3);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const view = segsFromNow();
    const disp = view.slice();

    setSegs(view.slice());
    setActive(3);

    const paint = () => {
      if (!cancelled) setSegs(disp.slice());
    };

    async function animate(from: string[], to: string[], start: number) {
      for (let i = 3; i >= start; i--) {
        setActive(i);
        for (let c = 1; c <= 2; c++) {
          disp[i] = from[i].slice(0, 2 - c);
          paint();
          if (cancelled) return;
          await sleep(DEL);
        }
      }
      for (let i = start; i <= 3; i++) {
        setActive(i);
        for (let c = 1; c <= 2; c++) {
          disp[i] = to[i].slice(0, c);
          paint();
          if (cancelled) return;
          await sleep(TYPE);
        }
      }
      setActive(3);
    }

    async function loop() {
      while (!cancelled) {
        const r = TARGET - Date.now();
        if (r <= 0) {
          setSegs(["00", "00", "00", "00"]);
          setLaunched(true);
          return;
        }
        await sleep((r % 1000) + 8);
        if (cancelled) return;
        const target = segsFromNow();
        let start = 3;
        let changed = false;
        for (let i = 0; i < 4; i++) {
          if (view[i] !== target[i]) {
            start = i;
            changed = true;
            break;
          }
        }
        if (!changed) continue;
        await animate(view, target, start);
        for (let i = 0; i < 4; i++) view[i] = target[i];
        disp.splice(0, 4, ...target);
      }
    }

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="inline-block w-full max-w-[21rem] border border-line bg-card">
      <div className="flex items-center justify-between gap-6 border-b border-line2 px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Public launch
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Sep 4, 2026 / 6:00 PM CT
        </span>
      </div>
      <div className="px-5 py-6 font-mono">
        {segs === null ? (
          <p className="text-sm text-muted">Loading countdown</p>
        ) : launched ? (
          <p className="text-lg text-signal">Now live. Protect your app.</p>
        ) : (
          <div className="flex items-end gap-1.5 whitespace-nowrap sm:gap-2.5">
            {segs.map((val, i) => (
              <div key={i} className="flex items-end gap-1.5 sm:gap-2.5">
                <div className="flex flex-col items-start">
                  <div
                    className="flex items-center text-[30px] leading-none tabular-nums text-ink sm:text-[34px]"
                    style={{ width: "1.62em", height: "1em" }}
                  >
                    <span>{val}</span>
                    <span
                      className={`ml-[1px] inline-block h-[0.9em] w-[0.1em] bg-signal ${
                        active === i ? "sc-caret" : "opacity-0"
                      }`}
                    />
                  </div>
                  <span className="mt-2 text-[10px] uppercase tracking-widest text-muted">
                    {LABELS[i]}
                  </span>
                </div>
                {i < 3 ? (
                  <span className="pb-6 text-xl leading-none text-line sm:text-2xl">
                    :
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
