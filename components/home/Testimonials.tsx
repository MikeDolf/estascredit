const reviews = [
  {
    quote:
      "Marco came out on a Sunday for our burst pipe, had the water back on within 90 minutes and the bill was exactly what he quoted on the phone. Genuinely the best tradie experience we've had in Prahran.",
    author: "Sarah K.",
    suburb: "Prahran",
    rating: 5,
  },
  {
    quote:
      "Other plumber quoted $1,800 to replace the hot water unit. Plumbing Co did it for $1,950 including the heat pump upgrade and the rebate — so we paid less and got a better unit.",
    author: "Dominic R.",
    suburb: "St Kilda",
    rating: 5,
  },
  {
    quote:
      "Called them for a blocked drain, they told me on the phone to try a kettle of boiling water first. It worked. Who does that? These guys. They'll get our business for life.",
    author: "Aisha B.",
    suburb: "South Yarra",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <div className="eyebrow">What neighbours say</div>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
            412 reviews. <br className="hidden md:block" />4.9 average. No bots.
          </h2>
        </div>
        <a
          href="#"
          className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5 md:inline-flex"
        >
          Read on Google
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
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
  );
}
