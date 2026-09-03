const items = [
  {
    label: "sitemap.xml",
    detail: "Auto-generated, lists every indexable route",
    href: "/sitemap.xml",
  },
  {
    label: "robots.txt",
    detail: "Allows all crawlers, points to the sitemap",
    href: "/robots.txt",
  },
  {
    label: "Canonical URLs",
    detail: "Every page declares its canonical to prevent duplicates",
  },
  {
    label: "Open Graph + Twitter Card meta",
    detail: "Sharable previews for every page",
  },
  {
    label: "Mobile-first viewport",
    detail: "Responsive by default, no horizontal scroll",
  },
  {
    label: "Semantic HTML5",
    detail: "<header>, <nav>, <main>, <article>, <footer> — a11y and SEO both win",
  },
  {
    label: "Static pre-rendering (SSG)",
    detail: "Every page is finished HTML before Google asks",
  },
  {
    label: "Image width/height attributes",
    detail: "Prevents CLS, boosts Core Web Vitals",
  },
  {
    label: "Next.js font optimization",
    detail: "Self-hosted webfonts, no FOUT",
  },
];

export default function TechSeoScorecard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white">
      <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Technical SEO passed
            </div>
            <div className="font-display text-lg font-bold text-ink">
              Lighthouse-ready. Google-ready. Shipping.
            </div>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-ink/5">
        {items.map((i) => (
          <li key={i.label} className="flex items-start gap-3 px-6 py-3">
            <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 5l2 2 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-ink">
                {i.href ? (
                  <a
                    href={i.href}
                    target="_blank"
                    rel="noopener"
                    className="underline-offset-4 hover:text-brand hover:underline"
                  >
                    {i.label}
                    <span aria-hidden="true" className="ml-1 text-[10px] align-middle text-ink/70">↗</span>
                  </a>
                ) : (
                  i.label
                )}
              </div>
              <div className="text-xs text-ink/60">{i.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
