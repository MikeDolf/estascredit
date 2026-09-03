import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import { articles } from "@/content/uralforklift-articles";
import { uralforklift as uf } from "@/lib/uralforklift";

export const metadata: Metadata = {
  title: { absolute: `Статьи про вилочные погрузчики · ${uf.name}` },
  description:
    "Разборы по вилочным погрузчикам: виды и характеристики, подбор под задачу, тоннаж, бренды и эксплуатация. Без маркетинга, по делу.",
  alternates: { canonical: "/articles/" },
  openGraph: {
    type: "website",
    title: "Статьи про вилочные погрузчики",
    description:
      "Разборы по вилочным погрузчикам: виды, характеристики, подбор под задачу, тоннаж и бренды.",
    url: "/articles/",
    siteName: uf.name,
    locale: uf.locale,
    images: [{ url: "/og/articles.png", width: 1200, height: 630, alt: "Статьи про вилочные погрузчики" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Статьи про вилочные погрузчики",
    description: "Виды, характеристики, подбор под задачу, тоннаж и бренды.",
    images: ["/og/articles.png"],
  },
  robots: { index: true, follow: true },
};

export default function ArticlesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Статьи про вилочные погрузчики",
        url: `${uf.siteUrl}/articles/`,
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${uf.siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${uf.siteUrl}/#organization`,
        name: uf.name,
        url: `${uf.siteUrl}/`,
        description: uf.description,
        areaServed: "RU",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Статьи", item: `${uf.siteUrl}/articles/` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-x pb-20 pt-10 md:pt-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ label: "Статьи" }]} />

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tightest md:text-5xl">
            Статьи про вилочные погрузчики
          </h1>
          <p className="mt-4 max-w-2xl text-[1.06rem] leading-[1.75] text-ink/80">
            Разбираем технику так, как её выбирают на практике: сначала груз, потом привод, потом
            всё остальное. Если из задачи следует, что покупать не надо, — об этом тоже написано.
          </p>

          <ul className="mt-10 space-y-5">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}/`}
                  className="block rounded-2xl border border-ink/10 bg-white p-6 shadow-card transition-colors hover:border-brand/30"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                    {a.cluster}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold tracking-tight md:text-2xl">
                    {a.h1}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{a.metaDescription}</p>
                  <div className="mt-3 text-xs text-ink/60">
                    <time dateTime={a.publishedAt}>
                      {new Date(a.publishedAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    {" · "}
                    {a.readingMinutes} мин чтения
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
