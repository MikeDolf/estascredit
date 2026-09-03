import { uralforklift as uf } from "@/lib/uralforklift";
import type { Article } from "@/content/uralforklift-articles";

/**
 * Вся разметка одной статьи: Article + Person + BreadcrumbList + FAQPage.
 * Один @graph, чтобы сущности ссылались друг на друга по @id.
 */
export default function ArticleJsonLd({ article }: { article: Article }) {
  const url = `${uf.siteUrl}/articles/${article.slug}/`;
  const authorId = `${uf.siteUrl}/#author`;

  const graph = [
    {
      "@type": "Article",
      headline: article.h1,
      description: article.metaDescription,
      image: `${uf.siteUrl}${article.hero.file}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      inLanguage: "ru-RU",
      keywords: article.keywordCluster.join(", "),
      wordCount: undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@id": authorId },
      publisher: { "@id": `${uf.siteUrl}/#organization` },
    },
    {
      "@type": "Person",
      "@id": authorId,
      name: uf.author.name,
      jobTitle: uf.author.role,
      description: uf.author.bio,
      url: `${uf.siteUrl}${uf.author.url}`,
      worksFor: { "@id": `${uf.siteUrl}/#organization` },
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
        { "@type": "ListItem", position: 2, name: article.metaTitle, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
