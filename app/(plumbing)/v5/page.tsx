import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorCard from "@/components/blog/AuthorCard";
import SectionImage from "@/components/blog/SectionImage";
import BlogJsonLd from "@/components/seo/BlogJsonLd";
import BlogBody from "@/components/blog/BlogBody";
import BackToTop from "@/components/blog/BackToTop";
import { voicedPost } from "@/content/blog-voiced";
import { business } from "@/lib/business";
import pexels from "@/content/pexels.json";

const images = (pexels as Record<string, any>)["plumber-for-running-toilet"];
const hero = images?.hero;

const p = voicedPost;

// Strip the body's Frequently-asked + Still-stuck sections — we render them
// separately below (structured FAQ with schema; Still stuck becomes a CTA).
const [bodyMain, afterFaq = ""] = p.body.split(/\n## Frequently asked\n/);
const stillStuckMatch = afterFaq.match(/## Still stuck[\s\S]*$/);
const stillStuckBody = stillStuckMatch
  ? stillStuckMatch[0].replace(/^## Still stuck[^\n]*\n+/, "")
  : "";

export const metadata: Metadata = {
  // Absolute title so the layout template doesn't double-append. 56 chars.
  title: { absolute: "Plumber for a Running Toilet: Fix or Call? | Plumbing Co" },
  description: p.description,
  alternates: { canonical: "/v5/" },
  openGraph: {
    type: "article",
    title: "Plumber for a Running Toilet: Fix or Call?",
    description: p.description,
    url: "/v5/",
    siteName: business.name,
    locale: "en_AU",
    publishedTime: p.publishedAt,
    modifiedTime: p.publishedAt,
    authors: [p.author.name],
    images: [
      {
        url: hero?.file || "/images/blog/plumber-for-running-toilet/hero.jpg",
        width: hero?.width ?? 940,
        height: hero?.height ?? 627,
        alt: hero?.alt || "Plumber fixing a running toilet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumber for a Running Toilet: Fix or Call?",
    description: p.description,
    images: [hero?.file || "/images/blog/plumber-for-running-toilet/hero.jpg"],
  },
  keywords: p.keywordCluster,
  authors: [{ name: p.author.name }],
  robots: { index: true, follow: true },
};

const toc = [
  { id: "why-is-my-toilet-running-the-5-common-causes", label: "Why is my toilet running? 5 causes" },
  { id: "signs-you-have-a-running-toilet-beyond-the-obvious-noise", label: "Signs (beyond the noise)" },
  { id: "tools-youll-need", label: "Tools you'll need" },
  { id: "how-to-stop-a-running-toilet-step-by-step", label: "How to stop it — step by step" },
  { id: "toilet-flapper-replacement-the-20-fix", label: "Flapper replacement ($20 fix)" },
  { id: "fill-valve-replacement-if-the-flapper-isnt-it", label: "Fill valve replacement" },
  { id: "when-to-call-a-plumber", label: "When to call a plumber" },
  { id: "how-much-to-fix-a-running-toilet-honest-numbers", label: "How much it costs" },
  { id: "how-much-water-does-a-running-toilet-waste", label: "How much water it wastes" },
  { id: "two-things-most-other-guides-miss", label: "Two things other guides miss" },
  { id: "frequently-asked", label: "Frequently asked" },
  { id: "still-stuck", label: "Still stuck? Call us" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function V5Page() {
  return (
    <>
      <BlogJsonLd
        title={p.title}
        description={p.description}
        slug="v5"
        publishedAt={p.publishedAt}
        author={{
          name: p.author.name,
          licence: p.author.licence,
          years: p.author.years,
        }}
        faqs={p.faqs}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/v5/" },
          { name: p.title, url: "/v5/" },
        ]}
      />

      <article className="container-x pt-10 pb-20 md:pt-14">
        <div className="mx-auto max-w-3xl">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/v5/" },
                { label: "Running toilet" },
              ]}
            />
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
            {p.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink/60">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                MD
              </div>
              <div>
                <div className="font-medium text-ink">{p.author.name}</div>
                <div className="text-xs">Licensed plumber · {business.address.suburb}</div>
              </div>
            </div>
            <span aria-hidden>·</span>
            <span>
              <span className="text-ink/70">Published </span>
              <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>
              <span className="text-ink/70">Last updated </span>
              <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>{p.readingMinutes} min read</span>
          </div>

          {hero && (
            <div className="mt-8">
              <SectionImage image={hero} priority />
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-soft/60 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
              TL;DR
            </div>
            <p className="mt-2 text-[1.02rem] leading-relaxed text-ink/85">{p.tldr}</p>
          </div>

          {/* Inline TOC — compact, above the body */}
          <div className="mt-8">
            <TableOfContents items={toc} />
          </div>

          <div className="mt-10">
            <BlogBody markdown={bodyMain} sectionImages={images} />
          </div>

          <div className="mt-12 rounded-3xl border border-ink/10 bg-white p-7 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              While you're here
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight md:text-2xl">
              Other things on this site that'll save you money.
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">→</span>
                <span>
                  <Link href="/v4/" className="font-semibold text-brand underline-offset-4 hover:underline">
                    Toilet repair — flat prices, same-day
                  </Link>{" "}
                  — if you've read this far and decided you're calling us anyway, here's the service page with the pricing table and what's included in the call-out.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">→</span>
                <span>
                  <Link href="/v2/" className="font-semibold text-brand underline-offset-4 hover:underline">
                    Low water pressure: what a plumber actually checks
                  </Link>{" "}
                  — different problem, same philosophy. Unscrew the aerator before booking anyone, is my unsolicited advice.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">→</span>
                <span>
                  <Link href="/v6/" className="font-semibold text-brand underline-offset-4 hover:underline">
                    The technical-SEO version of this post
                  </Link>{" "}
                  — for the people who care about that sort of thing. Same words, more schema.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-xs text-ink/70">
            Further reading:{" "}
            <a
              href="https://www.yourhome.gov.au/water/reducing-water-demand"
              target="_blank"
              rel="noopener nofollow"
              className="text-ink/85 underline-offset-4 hover:text-ink hover:underline"
            >
              Australian Government — Reducing water demand
            </a>
            {" · "}
            <a
              href="https://www.bunnings.com.au/our-range/bathroom-plumbing/toilets-accessories"
              target="_blank"
              rel="noopener nofollow"
              className="text-ink/85 underline-offset-4 hover:text-ink hover:underline"
            >
              Bunnings — toilet parts &amp; flapper kits
            </a>
          </div>

          <section id="frequently-asked" className="mt-14">
            {images?.["frequently-asked"] && (
              <div className="mb-6">
                <SectionImage image={images["frequently-asked"]} />
              </div>
            )}
            <div className="eyebrow">Frequently asked</div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tightest md:text-3xl">
              Straight answers, marked up for Google.
            </h2>
            <dl className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white shadow-card">
              {p.faqs.map((f) => (
                <div key={f.q} className="p-6">
                  <dt className="font-display text-base font-bold tracking-tight md:text-lg">
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-ink/70">
              These eight Q&amp;As are also emitted as FAQPage schema in the page head — Google
              may show the answers directly in the search results. Or not. You never really know
              with Google.
            </p>
          </section>

          <section id="still-stuck" className="mt-14">
            {images?.["still-stuck-give-us-a-call"] && (
              <div className="mb-6">
                <SectionImage image={images["still-stuck-give-us-a-call"]} />
              </div>
            )}
            <h2 className="font-display text-2xl font-bold tracking-tightest md:text-3xl">
              Still stuck? Give us a call.
            </h2>
            {stillStuckBody && (
              <div className="prose-plumb mt-4">
                <BlogBody markdown={stillStuckBody} />
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${business.phoneE164}`} className="btn-brand">
                Call {business.phone}
              </a>
              <Link href="/v4/" className="btn-primary">
                See our toilet repair page
              </Link>
            </div>
          </section>

          {/* Author card moved here from the removed sidebar — still provides E-E-A-T signal */}
          <div className="mt-12">
            <AuthorCard
              name={p.author.name}
              role={p.author.role}
              licence={p.author.licence}
              years={p.author.years}
              bio={p.author.bio}
            />
          </div>

          <BackToTop />
        </div>
      </article>
    </>
  );
}
