import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Our plumbing services — Plumbing Co",
  description:
    "Blocked drains, hot water, leaking taps, burst pipes, toilet repair. Flat prices, same-day across Melbourne's inner south. No call-out fee, 12-month warranty.",
  alternates: { canonical: "/services/" },
};

const services = [
  {
    slug: "toilet-repair",
    href: "/v4/",
    title: "Toilet repair",
    priceFrom: "$149",
    emergency: false,
    description:
      "Running toilet, slow fill, phantom flushing, leaking base — fixed same-day with a flat price. See the full pricing table and what's included.",
    cta: "See details",
  },
  {
    slug: "blocked-drains",
    href: "#contact",
    title: "Blocked drains",
    priceFrom: "$149",
    emergency: false,
    description:
      "Kitchen, bathroom, laundry, or main line. CCTV camera + jet-rodder on the van. Most clears done in under an hour. 30-day clear-drain guarantee.",
    cta: "Call for a quote",
  },
  {
    slug: "hot-water",
    href: "#contact",
    title: "Hot water systems",
    priceFrom: "$189",
    emergency: false,
    description:
      "Gas, electric, and heat-pump repair + replacement. We handle the VEU rebate paperwork. Like-for-like same-day; heat pump half-day.",
    cta: "Call for a quote",
  },
  {
    slug: "leaking-taps",
    href: "#contact",
    title: "Leaking taps & mixers",
    priceFrom: "$99",
    emergency: false,
    description:
      "Ceramic cartridges, washers, mixer reseats. Usually fixed in under 30 minutes. If your tap is older than the house, bring that up on the call.",
    cta: "Call for a quote",
  },
  {
    slug: "burst-pipes",
    href: "#contact",
    title: "Burst pipes",
    priceFrom: "$289",
    emergency: true,
    description:
      "Emergency line, 24/7. Onsite in under 60 minutes across Prahran, South Yarra, St Kilda, Toorak. Thermal-imaging leak detection — minimal wall damage.",
    cta: "Call emergency line",
  },
  {
    slug: "low-water-pressure",
    href: "/v2/",
    title: "Low water pressure",
    priceFrom: "$149",
    emergency: false,
    description:
      "Aerator clean, PRV replacement, galvanised main swap. Read the guide first — half the jobs are a 30-second aerator fix you can do yourself.",
    cta: "Read the guide",
  },
];

export default function ServicesIndex() {
  return (
    <section className="container-x pt-10 pb-20 md:pt-16">
      <header className="mx-auto max-w-3xl text-center">
        <div className="eyebrow">Services</div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tightest md:text-6xl">
          What we fix. <span className="squiggle">Every day.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Flat prices, approved before we start, no call-out fee if we can't help. Call{" "}
          <a
            href={`tel:${business.phoneE164}`}
            className="font-semibold text-brand underline-offset-4 hover:underline"
          >
            {business.phone}
          </a>{" "}
          and tell us what's going wrong.
        </p>
      </header>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={s.href}
            className="group relative flex flex-col rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition-shadow hover:border-brand/30 hover:shadow-xl"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              {s.emergency && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700">
                  24/7 emergency
                </span>
              )}
              From {s.priceFrom}
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              {s.title}
            </h2>
            <p className="mt-3 flex-1 text-ink/70">{s.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              {s.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M3 7h8m-3-4 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl bg-ink p-10 text-paper md:p-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
              Not sure which one?
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tightest md:text-4xl">
              Call us. We'll triage on the phone.
            </h2>
            <p className="mt-3 max-w-xl text-paper/70">
              Half the time we can tell you over the phone whether it's a DIY fix or worth sending
              someone. The other half, we'll give you a flat price before the van leaves.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <a
              href={`tel:${business.phoneE164}`}
              className="inline-flex items-center gap-3 rounded-full bg-paper px-6 py-4 text-ink hover:bg-brand hover:text-white"
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
          </div>
        </div>
      </div>
    </section>
  );
}
