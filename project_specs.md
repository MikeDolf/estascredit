# Project Specs — Plumbing Company SEO Demo Site

> Reconciles `SEO-brief.md` with `CLAUDE.md`. Read this file before any code is written.

---

## What the app does / who uses it

A public-facing marketing website for a fictional plumbing company, built as the on-camera demo for the "50K Clicks/Mo with Claude Code" YouTube video. Two audiences:

1. **Google Search Console** — needs real impression/click data, so the site must ship 1-2 weeks before filming with fully indexable static HTML.
2. **Viewers of the video** — need to see a site that looks like "someone paid $5K for it" and learn the pattern so they can adapt it for their own business.

No user accounts. No authentication. No backend interactions. Every page is statically rendered at build time.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript | Per `CLAUDE.md` |
| Framework | Next.js 15 (App Router) | Per `CLAUDE.md` and brief |
| Rendering | `output: 'export'` — Static Site Generation | Per brief. Every page pre-rendered to HTML at build — this is the whole point of the video. |
| Styling | Tailwind CSS | Per both docs |
| Images | Pexels API → WebP at build time | Per brief, fetched by post keyword |
| Hosting | Vercel | Per both docs |
| Content | MDX or markdown frontmatter for blog + service pages | Flat files, no CMS |

### Conflict to resolve — Supabase

`CLAUDE.md` lists Supabase (Auth, Postgres, Storage, RLS) as the backend-as-a-service. **This project does not need Supabase.** It's a static marketing site with no user data, auth, or dynamic content. Adding Supabase would:
- Break `output: 'export'` (SSG requires no runtime server calls on page load)
- Add keys/setup that confuse the viewer during the demo
- Contradict the core lesson of the video ("static = ranks")

**Proposal:** drop Supabase for this project. All Supabase-specific rules in `CLAUDE.md` (RLS, service_role key, signed URLs, `/lib/supabase/`, `/supabase/`) become non-applicable. Please confirm.

### Conflict to resolve — file structure

`CLAUDE.md` includes folders that belong to a different project (candidate interview app): `/app/(admin)/`, `/app/interview/[token]/`. Those don't apply here.

**Proposal:** use the structure below instead. Please confirm.

---

## Pages and user flows

All pages are public and statically rendered. No authenticated flows.

| Route | Type | Schema |
|-------|------|--------|
| `/` | Homepage — hero + services overview + testimonials + CTA | LocalBusiness |
| `/about` | About — credentials, years in business, team | LocalBusiness |
| `/contact` | Contact — address, phone, hours, map | LocalBusiness |
| `/services` | Services overview | — |
| `/services/[slug]` | Individual service page (3-5 filled in) | Service + LocalBusiness |
| `/blog` | Blog index | — |
| `/blog/[slug]` | Individual blog post (10-15 filled in) | Article |

Plus SEO infrastructure: `/sitemap.xml`, `/robots.txt`, Open Graph tags, canonical URLs, JSON-LD schema on every page.

---

## Data models / where data is stored

No database. Flat files only:

- `content/blog/*.mdx` — blog posts, each with frontmatter (`title`, `description`, `keywords`, `publishedAt`, `author`, `featuredImage`)
- `content/services/*.mdx` — service pages, each with frontmatter (`title`, `description`, `price`, `cta`, `testimonials`, `faq`)
- `content/business.ts` — single source of truth for the fictional business: name, phone, address, hours, service area, reviews (fed into LocalBusiness schema + contact page + footer)

Images for blog posts are fetched from Pexels at build time based on the post's `keywords` frontmatter field, converted to WebP, and saved locally.

---

## Third-party services

- **Pexels API** — build-time image fetch. Key in `.env.local` as `PEXELS_API_KEY`.
- **Vercel** — hosting. No runtime env vars needed after export.
- **Google Search Console** — external (manual setup), sitemap submitted after deploy.

No Stripe. No Supabase. No auth provider.

---

## File structure

```
/app
  layout.tsx
  page.tsx                    # homepage
  about/page.tsx
  contact/page.tsx
  services/
    page.tsx                  # services index
    [slug]/page.tsx           # service detail
  blog/
    page.tsx                  # blog index
    [slug]/page.tsx           # blog detail
  sitemap.ts
  robots.ts
/components
  site/                       # Header, Footer, CTA, TestimonialStrip, etc.
  seo/                        # JsonLd, OpenGraph helpers
  blog/                       # PostCard, PostBody, RelatedPosts
  service/                    # ServiceHero, Pricing, FAQ, TrustSignals
/content
  blog/*.mdx
  services/*.mdx
  business.ts                 # single source of truth for business info
/lib
  seo.ts                      # canonical, og, schema helpers
  mdx.ts                      # frontmatter parsing, static param generation
  pexels.ts                   # build-time image fetcher
/public
  images/                     # Pexels-pulled WebP images (build output)
  og/                         # Open Graph images
/scripts
  fetch-images.ts             # runs pre-build, pulls Pexels images per post
/skills
  on-page-seo.md              # shared reference — titles, meta, H1/H2, schema, alt text, internal linking
  write-blog-post.md          # SERP analysis + voice-matched blog post
  write-service-page.md       # SERP analysis + conversion-focused service page
CLAUDE.md                     # business voice + project rules (updated)
project_specs.md              # this file
next.config.mjs               # output: 'export'
.env.local                    # PEXELS_API_KEY only
```

---

## CLAUDE.md needs a second voice file

Per the brief, the demo's star is a **second CLAUDE.md-style file** that captures the *fictional plumbing business's* voice (not Jono's, not the project rules). This goes in `/skills/` or at the root as `business-voice.md` and is referenced by both content-generation skills. It contains:

- Business backstory, owner's voice, opinions
- Real-sounding numbers (years in business, job count, average ticket)
- Local knowledge (suburb names, common issues in the region)
- Pricing language (how they talk about cost without giving hard quotes)

This is the file viewers will adapt for their own business — it's the core artifact of the video.

---

## What "done" looks like for Phase 1 (site structure)

Per the brief's suggested starting point:

- [ ] Next.js 15 project initialized with TypeScript, Tailwind, `output: 'export'`
- [ ] `business.ts` populated with fictional plumbing company details
- [ ] All 7 route types exist and render without errors
- [ ] Header + Footer shared across pages
- [ ] Homepage, blog index, blog post template, service page template visually polished ("$5K feel")
- [ ] Placeholder content in each (one real blog post, one real service page is enough for Phase 1)
- [ ] `npm run build` completes with no errors
- [ ] `out/` directory contains static HTML for every route
- [ ] `view-source:` on every page shows the full rendered content (the money shot of the video)

Phases 2+ (Pexels integration, skill files, content generation, Search Console, Lighthouse) come after Phase 1 is approved.

---

## Open questions before I start

1. **Confirm: drop Supabase for this project?** (Strong yes from me — see tech stack note.)
2. **Confirm: replace `CLAUDE.md` file structure section** with the one above before I build?
3. **Fictional business name + location?** I need a name (e.g., "Southside Plumbing Co.") and city/suburb (e.g., "Melbourne's inner south") to populate `business.ts` and make the LocalBusiness schema real. Happy to invent one if you don't have a preference.
4. **Accent color preference?** Brief says "one accent color." Default I'd pick: a deep navy with a single warm accent (copper/amber) — trustworthy trades feel, not the generic plumber-blue everyone uses. Override if you want something else.
5. **Content topics for Phase 2?** Do you have a keyword cluster in mind (e.g., "blocked drain Melbourne", "hot water repair", "leaking tap fix") or should I research the cluster myself based on a chosen location?
