export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="26" height="26" rx="7" fill="#0B0B0F" />
        <path
          d="M9 19V11a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v7.5"
          stroke="#5B4BFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="19" cy="12" r="2" fill="#FFE27A" />
      </svg>
      <span className="font-display text-[1.1rem] font-bold tracking-tight text-ink">
        Plumbing<span className="text-brand">.</span>Co
      </span>
    </span>
  );
}
