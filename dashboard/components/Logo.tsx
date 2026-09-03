export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="20" height="20" stroke="#0b0c0e" strokeWidth="1.5" />
        <path d="M1 11 H7" stroke="#0b0c0e" strokeWidth="1.5" />
        <path d="M15 11 H21" stroke="#0b0c0e" strokeWidth="1.5" />
        <path d="M11 1 V6 M11 16 V21" stroke="#0b0c0e" strokeWidth="1.5" />
        <rect x="7.5" y="7.5" width="7" height="7" fill="#0f7a3d" />
      </svg>
      <span className="font-mono text-[15px] font-semibold tracking-tight text-ink">
        StackCircuit<span className="text-signal">365</span>
      </span>
    </span>
  );
}
