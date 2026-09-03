import type { Metadata } from "next";
import BlogBody from "@/components/blog/BlogBody";
import SectionImage from "@/components/blog/SectionImage";
import { aiSlopPost } from "@/content/blog-ai-slop";
import pexels from "@/content/pexels.json";

export const metadata: Metadata = {
  title: aiSlopPost.title,
  description: aiSlopPost.description,
  alternates: { canonical: "/v2/" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function V2Page() {
  const p = aiSlopPost;
  const images = (pexels as Record<string, any>)["plumber-for-low-water-pressure"];
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
          <span>{p.author}</span>
          <span>·</span>
          <span>{formatDate(p.publishedAt)}</span>
          <span>·</span>
          <span>{p.readingMinutes} min read</span>
        </div>

        <div className="mt-10">
          <BlogBody markdown={p.body} sectionImages={images} />
        </div>
      </div>
    </article>
  );
}
