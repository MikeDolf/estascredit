import type { Metadata } from "next";
import BlogBody from "@/components/blog/BlogBody";
import SectionImage from "@/components/blog/SectionImage";
import { voicedPost } from "@/content/blog-voiced";
import pexels from "@/content/pexels.json";

export const metadata: Metadata = {
  title: voicedPost.title,
  description: voicedPost.description,
  alternates: { canonical: "/v3/" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function V3Page() {
  const p = voicedPost;
  const images = (pexels as Record<string, any>)["plumber-for-running-toilet"];
  const hero = images?.hero;

  return (
    <article className="container-x pt-10 pb-20 md:pt-14">
      <div className="mx-auto max-w-3xl">
        {hero && (
          <div>
            <SectionImage image={hero} priority />
          </div>
        )}

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
              <div className="text-xs">{p.author.role}</div>
            </div>
          </div>
          <span>·</span>
          <span>{formatDate(p.publishedAt)}</span>
          <span>·</span>
          <span>{p.readingMinutes} min read</span>
        </div>

        <div className="mt-10 rounded-2xl border border-brand/20 bg-brand-soft/60 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
            TL;DR
          </div>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-ink/85">{p.tldr}</p>
        </div>

        <div className="mt-10">
          <BlogBody markdown={p.body} sectionImages={images} />
        </div>
      </div>
    </article>
  );
}
