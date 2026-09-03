import type { Metadata } from "next";
import Link from "next/link";
import { voicedPost } from "@/content/blog-voiced";
import pexels from "@/content/pexels.json";

export const metadata: Metadata = {
  title: "Plumbing advice & guides — Plumbing Co",
  description:
    "Honest, plainly-written plumbing advice from a licensed Melbourne plumber. Fix it yourself where you can. Know when to call someone where you can't.",
  alternates: { canonical: "/blog/" },
};

const runningToiletImg =
  (pexels as Record<string, any>)["plumber-for-running-toilet"]?.hero;

const posts = [
  {
    href: "/v5/",
    title: voicedPost.title,
    excerpt: voicedPost.description,
    author: voicedPost.author.name,
    publishedAt: voicedPost.publishedAt,
    readingMinutes: voicedPost.readingMinutes,
    image: runningToiletImg,
    tag: "Featured",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndex() {
  return (
    <section className="container-x pt-10 pb-20 md:pt-16">
      <header className="mx-auto max-w-3xl text-center">
        <div className="eyebrow">The blog</div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tightest md:text-6xl">
          Plumbing advice, <span className="squiggle">plainly written</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Fix it yourself where you can. Know when to call someone where you can't. Written by a
          licensed plumber who'd rather talk you out of a job than charge for a kettle.
        </p>
      </header>

      {/* Featured */}
      {posts[0] && (
        <Link
          href={posts[0].href}
          className="mt-14 block overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card transition-shadow hover:shadow-xl md:grid md:grid-cols-5"
        >
          <div className="relative aspect-[4/3] bg-brand-soft md:col-span-2 md:aspect-auto">
            {posts[0].image ? (
              <img
                src={posts[0].image.file}
                alt={posts[0].image.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="44" stroke="#0B0B0F" strokeWidth="3" />
                  <path d="M60 36v48M36 60h48" stroke="#5B4BFF" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            )}
            {posts[0].tag && (
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper">
                {posts[0].tag}
              </div>
            )}
          </div>
          <div className="p-7 md:col-span-3 md:p-10">
            <div className="flex items-center gap-3 text-xs text-ink/60">
              <span>{formatDate(posts[0].publishedAt)}</span>
              <span>·</span>
              <span>{posts[0].readingMinutes} min read</span>
              <span>·</span>
              <span>{posts[0].author}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl">
              {posts[0].title}
            </h2>
            <p className="mt-4 max-w-xl text-ink/75">{posts[0].excerpt}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              Read the full guide
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 7h8m-3-4 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Placeholder for "more posts" — empty state copy in Marco's voice */}
      <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-ink/15 bg-white/50 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="mt-4 font-display text-lg font-bold tracking-tight">More guides on the way.</div>
        <p className="mt-2 text-sm text-ink/60">
          Writing the next one between jobs. If there's a plumbing question you want answered honestly,
          email <a href="mailto:hello@plumbingco.com.au" className="font-semibold text-brand hover:underline">hello@plumbingco.com.au</a> and I'll put it on the list.
        </p>
      </div>
    </section>
  );
}
