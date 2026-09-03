import { business } from "@/lib/business";

const icons = {
  drain: (
    <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="44" stroke="#F6F5F1" strokeWidth="3" />
      <path
        d="M36 60h48M60 36v48M42 42l36 36M78 42L42 78"
        stroke="#F6F5F1"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  water: (
    <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
      <path
        d="M60 20 C40 50 28 68 28 80 A32 32 0 0 0 92 80 C92 68 80 50 60 20 Z"
        fill="#5B4BFF"
        stroke="#0B0B0F"
        strokeWidth="3"
      />
      <path d="M44 80 a16 16 0 0 0 16 8" stroke="#FFE27A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  tap: (
    <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
      <rect x="34" y="30" width="52" height="22" rx="4" fill="#0B0B0F" />
      <rect x="54" y="52" width="12" height="22" fill="#0B0B0F" />
      <path d="M54 74 h12 v6 a6 6 0 0 1 -12 0 z" fill="#5B4BFF" />
      <path d="M60 90 v12" stroke="#5B4BFF" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  burst: (
    <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
      <path d="M20 70 h40 l10 -12 h30" stroke="#0B0B0F" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M62 58 l-10 -20 M68 58 l0 -24 M74 58 l10 -20"
        stroke="#5B4BFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function ArrowBadge() {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-rotate-45">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M3 11L11 3M5 3h6v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function FeatureGrid() {
  return (
    <section id="services" className="container-x mt-6 md:mt-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
        {/* Big feature — spans 2 cols, 2 rows */}
        <a
          href="#contact"
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-ink text-paper md:col-span-2 md:row-span-2"
        >
          <div className="absolute right-5 top-5 z-10">
            <ArrowBadge />
          </div>
          <div className="grid min-h-[240px] flex-1 place-items-center p-10">{icons.drain}</div>
          <div className="border-t border-white/10 bg-black/20 p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">
              Blocked drains. Cleared fast.
            </h3>
            <p className="mt-1 text-sm text-white/70">From $149 · Same-day</p>
          </div>
        </a>

        <a
          href="#contact"
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-brand-soft"
        >
          <div className="absolute right-4 top-4 z-10">
            <ArrowBadge />
          </div>
          <div className="grid min-h-[180px] flex-1 place-items-center p-6">{icons.water}</div>
          <div className="border-t border-ink/5 bg-white/60 p-5">
            <h3 className="font-display text-lg font-bold leading-tight text-ink">Hot water fixed</h3>
            <p className="mt-1 text-sm text-ink/65">Same-day · From $189</p>
          </div>
        </a>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-brand p-6 text-white md:p-7">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#F5C891]" />
              <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#D9B894]" />
              <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#9FC2E6]" />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-white/80">
              412 locals served this quarter
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <div className="font-display text-5xl font-bold leading-none">
                {business.review.rating}
              </div>
              <div className="text-yellow-300">★★★★★</div>
            </div>
            <div className="mt-1 text-sm text-white/85">{business.review.count} Google reviews</div>
          </div>
        </div>

        <a
          href="#contact"
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#F3EFE6]"
        >
          <div className="absolute right-4 top-4 z-10">
            <ArrowBadge />
          </div>
          <div className="grid min-h-[180px] flex-1 place-items-center p-6">{icons.tap}</div>
          <div className="border-t border-ink/5 bg-white/60 p-5">
            <h3 className="font-display text-lg font-bold leading-tight text-ink">
              Leaking taps, no more drips
            </h3>
            <p className="mt-1 text-sm text-ink/65">From $99 · In &lt; 30 min</p>
          </div>
        </a>

        <a
          href="#contact"
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#FFF4C9]"
        >
          <div className="absolute right-4 top-4 z-10">
            <ArrowBadge />
          </div>
          <div className="grid min-h-[180px] flex-1 place-items-center p-6">{icons.burst}</div>
          <div className="border-t border-ink/5 bg-white/60 p-5">
            <h3 className="font-display text-lg font-bold leading-tight text-ink">
              Burst pipes, 24/7
            </h3>
            <p className="mt-1 text-sm text-ink/65">Onsite in &lt; 60 min</p>
          </div>
        </a>
      </div>
    </section>
  );
}
