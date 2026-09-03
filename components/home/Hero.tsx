import { business } from "@/lib/business";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_50%_-100px,rgba(91,75,255,0.10),transparent_60%)]" />
      </div>

      {/* doodle — left, pipe wrench */}
      <svg
        aria-hidden
        viewBox="0 0 220 260"
        className="absolute left-0 top-20 hidden h-[220px] w-[180px] lg:block"
      >
        <g stroke="#0B0B0F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 220 L120 140" />
          <path d="M40 220 L60 240" />
          <rect x="100" y="110" width="70" height="40" rx="8" transform="rotate(-45 135 130)" />
          <circle cx="150" cy="100" r="10" />
        </g>
        <path d="M155 95 l-14 14" stroke="#5B4BFF" strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* doodle — right, water drops */}
      <svg
        aria-hidden
        viewBox="0 0 220 260"
        className="absolute right-4 top-28 hidden h-[200px] w-[160px] lg:block"
      >
        <g fill="none" stroke="#0B0B0F" strokeWidth="3" strokeLinecap="round">
          <path d="M60 60 Q50 80 60 100 Q70 80 60 60 Z" fill="#EEEBFF" />
          <path d="M120 120 Q108 142 120 168 Q132 142 120 120 Z" fill="#FFE27A" />
          <path d="M80 180 Q72 196 80 214 Q88 196 80 180 Z" fill="#EEEBFF" />
        </g>
        <path
          d="M30 40 C60 20 100 60 140 30"
          stroke="#5B4BFF"
          strokeWidth="3"
          fill="none"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
      </svg>

      <div className="container-x pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-70"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Available today in Melbourne's inner south
          </div>

          <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tightest text-ink md:text-[4.4rem] lg:text-[5.2rem]">
            Honest plumbers.
            <br />
            Same-day{" "}
            <span className="inline-flex items-center">
              <svg
                aria-hidden
                viewBox="0 0 64 48"
                className="mx-1 inline-block h-[0.85em] w-auto -translate-y-1 md:mx-2"
              >
                <rect x="2" y="8" width="60" height="32" rx="6" fill="#5B4BFF" />
                <rect x="10" y="16" width="20" height="16" rx="2" fill="#EEEBFF" />
                <circle cx="44" cy="24" r="5" fill="#FFE27A" />
                <circle cx="56" cy="24" r="2.5" fill="#FFE27A" />
              </svg>
              if we can.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 md:text-lg">
            Licensed plumbers serving Melbourne's inner south since {business.founded}. Upfront
            pricing, no call-out fee surprises, and we clean up before we leave.
          </p>

          {/* Search-bar style CTA block */}
          <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-ink/10 bg-white p-2 shadow-card md:mt-10">
            <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 md:w-48 md:border-r md:border-ink/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M8 14s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8Z"
                    stroke="#0B0B0F"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="6" r="2" stroke="#0B0B0F" strokeWidth="1.5" />
                </svg>
                <span className="text-sm font-semibold text-ink">Prahran, VIC</span>
              </div>
              <div className="flex-1 px-4 py-3 text-left text-sm text-ink/60">
                What's going wrong? (e.g. blocked drain)
              </div>
              <a href="#contact" className="btn-brand w-full md:w-auto">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Get a quote
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink/60">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Licence {business.licenseNumber}
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {business.review.rating}★ from {business.review.count} Google reviews
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              No call-out fee
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
