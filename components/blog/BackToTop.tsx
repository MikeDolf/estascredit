export default function BackToTop() {
  return (
    <div className="mt-12 flex justify-center">
      <a
        href="#main"
        className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink/70 shadow-sm transition-colors hover:border-brand/30 hover:bg-brand-soft hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 11V3M3 7l4-4 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to the top — there was actually useful stuff up there
      </a>
    </div>
  );
}
