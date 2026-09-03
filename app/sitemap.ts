import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { uralforklift as uf } from "@/lib/uralforklift";
import { articles } from "@/content/uralforklift-articles";

export const dynamic = "force-static";

/**
 * В репозитории живут два сайта на разных доменах, а sitemap.xml может быть
 * только один и только для своего хоста. Поэтому набор маршрутов выбирается
 * переменной SITE на сборке:
 *
 *   npm run build            → демо «Plumbing Co» (поведение по умолчанию)
 *   SITE=uf npm run build    → УралФорклифт, estascredit.ru
 */
export const SITE = process.env.SITE === "uf" ? "uf" : "plumbing";

export function siteBase(): string {
  const url = SITE === "uf" ? uf.siteUrl : business.siteUrl;
  return url.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteBase();
  const now = new Date();

  const routes =
    SITE === "uf"
      ? [
          { path: "/articles/", priority: 0.9 },
          ...articles.map((a) => ({ path: `/articles/${a.slug}/`, priority: 1.0 })),
        ]
      : [
          { path: "/", priority: 1.0 },
          { path: "/services/", priority: 0.9 },
          { path: "/blog/", priority: 0.9 },
          { path: "/v2/", priority: 0.5 },
          { path: "/v3/", priority: 0.8 },
          { path: "/v4/", priority: 0.9 },
          { path: "/v5/", priority: 0.9 },
          { path: "/v6/", priority: 1.0 },
        ];

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
