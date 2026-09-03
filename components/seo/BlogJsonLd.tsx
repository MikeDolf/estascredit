import { business } from "@/lib/business";

type FAQ = { q: string; a: string };

export default function BlogJsonLd({
  title,
  description,
  slug,
  publishedAt,
  author,
  faqs,
  breadcrumbs,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author: { name: string; licence: string; years: number };
  faqs?: FAQ[];
  breadcrumbs: { name: string; url: string }[];
}) {
  const base = business.siteUrl.replace(/\/$/, "");
  const url = `${base}/${slug}/`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: "Licensed plumber",
      identifier: author.licence,
    },
    publisher: {
      "@type": "Organization",
      name: business.name,
      url: base,
    },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: url,
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${base}${b.url}`,
    })),
  };

  const faqPage = faqs && faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  );
}
