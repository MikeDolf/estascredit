# SEO — live demo site

Six pages in one Next.js project, each showing a stage of the SEO workflow for a fictional Melbourne plumber (Plumbing Co) plus a California landing page. Every page is statically pre-rendered — view-source on any route shows finished HTML.

## The six versions

| Route | Stage | What's demonstrated |
|-------|-------|---------------------|
| `/v1` | Scaffolded site | Claude Code builds the homepage from a prompt |
| `/v2` | AI blog slop | Generic AI blog post with no voice files |
| `/v3` | Voice-injected | Same post rewritten using `references/voice.md + humour.md + stats.md + stories.md + opinions.md` |
| `/v4` | Landing page | City+service landing page (`plumber baldwin park ca`), homepage silhouette, local NAP schema |
| `/v5` | On-page SEO | v3's post run through the 15-category, 80+ item on-page SEO checklist |
| `/v6` | Technical SEO | v5 + sitemap, robots, OG images, Organization schema, favicon |

## Stack

- **Next.js 15 (App Router)** with `output: 'export'` — full SSG, no runtime server
- **TypeScript**
- **Tailwind CSS**
- **Pexels API** for build-time images (hero + one per H2 section, with attribution)
- **Vercel** for hosting

## Local dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```

## Pexels images

Set `PEXEL_API` in `.env` and run:

```bash
node scripts/fetch-pexels.mjs
```

This downloads a hero + one image per H2 heading for every blog post, saves them to `/public/images/blog/<post>/<section>.jpg`, and writes photographer attribution to `/content/pexels.json`.

## References folder

The voice layer lives in `/references/`:

- `voice.md` — Marco's writing style
- `humour.md` — dad-joke frequency, anti-patterns, examples
- `stats.md` — canonical real numbers (pricing, review counts, response times)
- `stories.md` — recurring anecdotes
- `opinions.md` — industry opinions backed by numbers
- `used-keywords.md` — tracker so primary keywords aren't reused

Every content-generation task reads these files first. See `CLAUDE.md` at the root for the full instructions.

## Keyword research

- `Plumbing-Keywords_list_2026-04-20 (1).csv` — blog post keyword research (used for v2 / v3 / v5 / v6)
- `Service-Keywords.csv` — city+service keyword research (used for v4)

## SEO reference files

- `on-page-seo.md` — 80+ item on-page SEO checklist applied to v5
- `slideshow/onpage-seo-checklist.html` — visual reference for the checklist
- `slideshow/technical-seo.html` — visual reference for technical SEO

---

Built with [Claude Code](https://claude.com/claude-code).
