import type { MetadataRoute } from "next";
import { siteBase } from "./sitemap";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteBase();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
