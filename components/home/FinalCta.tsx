import { business } from "@/lib/business";

export default function FinalCta() {
  return (
    <section id="contact" className="container-x mt-24 md:mt-32">
      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-10 md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_10%,rgba(91,75,255,0.12),transparent_60%)]"
        />
        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
              Got a leak? <br />
              Let's fix it today.
            </h2>
            <p className="mt-4 max-w-xl text-ink/70">
              Call now and speak to a real plumber — no call centre, no sales script. We'll tell
              you what it'll cost before anyone gets in a van.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:col-span-5 md:items-end">
            <a
              href={`tel:${business.phoneE164}`}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-all hover:bg-brand"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 4a1 1 0 0 1 1-1h2l1 3-1.5 1A8 8 0 0 0 9 12l1-1.5 3 1v2a1 1 0 0 1-1 1A10 10 0 0 1 3 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-xl font-bold">{business.phone}</span>
            </a>
            <a
              href={`mailto:${business.email}`}
              className="text-sm font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
            >
              or email {business.email} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
