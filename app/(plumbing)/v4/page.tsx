import type { Metadata } from "next";
import Link from "next/link";
import { baldwinParkLanding as loc } from "@/content/landing-baldwin-park";

export const metadata: Metadata = {
  // 57 chars
  title: {
    absolute: `Plumber in Baldwin Park, CA · Same-day, flat price | Plumbing Co`,
  },
  description: `Licensed plumber in Baldwin Park, CA. Same-day service across the San Gabriel Valley — blocked drains, hot water, leaks. Flat price, no call-out fee. Call ${loc.phone}.`,
  alternates: { canonical: "/v4/" },
  openGraph: {
    type: "website",
    title: "Plumber in Baldwin Park, CA — Plumbing Co",
    description: `Licensed plumber serving Baldwin Park and the San Gabriel Valley since ${loc.foundedLocal}. Flat price, same-day, no call-out fee.`,
    url: "/v4/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumber in Baldwin Park, CA — Plumbing Co",
    description: `Licensed plumber serving Baldwin Park and the San Gabriel Valley since ${loc.foundedLocal}.`,
  },
  keywords: loc.keywordCluster,
  robots: { index: true, follow: true },
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

const steps = [
  {
    n: "01",
    title: "Tell us what's going wrong",
    body: "Call, text, or book online. We'll triage on the phone and tell you honestly if it's a DIY fix before sending anyone.",
  },
  {
    n: "02",
    title: "Fixed price before we start",
    body: "Once we've seen the job, you get a flat, written price. Approve it, we start. Decline, we leave — no call-out fee.",
  },
  {
    n: "03",
    title: "Done, cleaned up, warranted",
    body: "Most jobs finished same day. 12-month workmanship warranty, and we don't leave until the mess is gone.",
  },
];

export default function V4Page() {
  return (
    <>
      {/* LocalBusiness schema — Baldwin Park branch */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Plumber",
            name: `Plumbing Co — Baldwin Park`,
            url: "https://plumbing-co.example.com/v4/",
            telephone: loc.phoneE164,
            email: loc.email,
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              streetAddress: loc.address.street,
              addressLocality: loc.address.suburb,
              addressRegion: loc.address.state,
              postalCode: loc.address.postcode,
              addressCountry: loc.address.country,
            },
            areaServed: loc.serviceAreas.map((s) => ({ "@type": "City", name: s })),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: loc.review.rating,
              reviewCount: loc.review.count,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "07:00",
                closes: "19:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "08:00",
                closes: "17:00",
              },
            ],
          }),
        }}
      />

      {/* Hero — mirrors v1 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_50%_-100px,rgba(91,75,255,0.10),transparent_60%)]" />
        </div>

        <div className="container-x pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-70"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Available today in {loc.city}, {loc.state}
            </div>

            <h1 className="font-display text-[2.4rem] font-bold leading-[1.02] tracking-tightest text-ink md:text-[4rem] lg:text-[4.6rem]">
              Plumber in {loc.city},
              <br />
              {loc.state}. Same-day, flat price.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 md:text-lg">
              Licensed California plumbers serving {loc.city} and the {loc.county} since{" "}
              {loc.foundedLocal}. Upfront pricing, no call-out fee surprises, and we clean up before
              we leave.
            </p>

            {/* Search-bar style CTA */}
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
                  <span className="truncate text-sm font-semibold text-ink">
                    {loc.city}, {loc.state}
                  </span>
                </div>
                <div className="flex-1 truncate whitespace-nowrap px-4 py-3 text-left text-sm text-ink/60">
                  What's going wrong?
                </div>
                <a href={`tel:${loc.phoneE164}`} className="btn-brand w-full md:w-auto">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M9 9l3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Get a quote
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink/60">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Licensed CA #{loc.licenseNumber}
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {loc.review.rating}★ from {loc.review.count} Google reviews
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                No call-out fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid — same as homepage */}
      <section id="services" className="container-x mt-6 md:mt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
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
              <h3 className="font-display text-lg font-bold leading-tight text-ink">
                Water heater fixed
              </h3>
              <p className="mt-1 text-sm text-ink/65">Same-day · From $189</p>
            </div>
          </a>

          {/* Rating card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-brand p-6 text-white md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#F5C891]" />
                <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#D9B894]" />
                <div className="h-8 w-8 rounded-full border-2 border-brand bg-[#9FC2E6]" />
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                {loc.jobsCompleted.toLocaleString()} jobs across the San Gabriel Valley
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <div className="font-display text-5xl font-bold leading-none">
                  {loc.review.rating}
                </div>
                <div className="text-yellow-300">★★★★★</div>
              </div>
              <div className="mt-1 text-sm text-white/85">
                {loc.review.count} Google reviews · {loc.city}
              </div>
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

      {/* How it works */}
      <section className="container-x mt-24 md:mt-32">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">How it works</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
              Three steps. <span className="squiggle">No surprises.</span>
            </h2>
            <p className="mt-4 max-w-sm text-ink/70">
              We built our pricing model after getting sick of hearing "the other guy charged me
              $900 for a washer". Flat prices, approved before we start.
            </p>
          </div>

          <ol className="grid gap-4 md:col-span-8 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative rounded-2xl border border-ink/10 bg-white p-6 shadow-card"
              >
                <div className="mb-5 inline-flex h-10 items-center rounded-full bg-ink px-3 text-xs font-bold tracking-widest text-paper">
                  {s.n}
                </div>
                <div className="font-display text-xl font-bold leading-tight">{s.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials — Baldwin Park customers */}
      <section className="container-x mt-24 md:mt-32">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow">What neighbors say</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
              {loc.review.count} reviews. <br className="hidden md:block" />
              {loc.review.rating} average. No bots.
            </h2>
          </div>
          <a
            href="#"
            className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5 md:inline-flex"
          >
            Read on Google
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 11L11 3M5 3h6v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {loc.testimonials.map((r, i) => (
            <figure
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-7 shadow-card"
            >
              <blockquote className="text-[15px] leading-relaxed text-ink/85">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink">{r.author}</div>
                  <div className="text-xs text-ink/60">{r.suburb}</div>
                </div>
                <div className="text-sm tracking-tighter text-amber-500">★★★★★</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Service areas */}
      <section className="container-x mt-24 md:mt-32">
        <div className="overflow-hidden rounded-3xl bg-ink p-10 text-paper md:p-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
                Where we work
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
                {loc.city} and the {loc.county}. <br />
                <span className="text-brand">On the road in under 60 minutes.</span>
              </h2>
              <p className="mt-5 max-w-xl text-paper/70">
                We keep our service radius tight so our vans are never more than 20 minutes from
                your address. That's how same-day actually works.
              </p>
            </div>

            <div className="md:col-span-5">
              <ul className="flex flex-wrap gap-2">
                {loc.serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-paper/15 bg-paper/5 px-4 py-2 text-sm text-paper/90 backdrop-blur"
                  >
                    {area}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-paper/50">
                Not sure if we cover your area? Call {loc.phone} — if we can't, we'll recommend
                someone we trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="container-x mt-24 md:mt-32">
        <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_10%,rgba(91,75,255,0.12),transparent_60%)]"
          />
          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
                Got a leak in {loc.city}? <br />
                Let's fix it today.
              </h2>
              <p className="mt-4 max-w-xl text-ink/70">
                Call now and speak to a real plumber — no call center, no sales script. We'll tell
                you what it'll cost before anyone gets in a van.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:col-span-5 md:items-end">
              <a
                href={`tel:${loc.phoneE164}`}
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
                <span className="font-display text-xl font-bold">{loc.phone}</span>
              </a>
              <a
                href={`mailto:${loc.email}`}
                className="text-sm font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
              >
                or email {loc.email} →
              </a>
              <Link
                href="/v5/"
                className="text-xs text-ink/70 underline-offset-4 hover:text-ink hover:underline"
              >
                Related: our guide to running toilets →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
