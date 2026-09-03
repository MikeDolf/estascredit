---
name: blog
description: Generate a new long-form, SEO-optimised, voice-matched blog post. Picks an unused keyword from `keywords.csv`, researches the top-3 SERP, fetches Pexels images, renders with the `/v5` template, and marks the keyword used. Use when the user types `/blog` or asks for a new blog post.
---

# `/blog` — Blog post generator

Creates a production-ready blog post end-to-end. Output: a new route at `/app/blog/<slug>/page.tsx`, a content file at `/content/blog-<slug>.ts`, downloaded Pexels images under `/public/images/blog/<slug>/`, and updated `references/used-keywords.md`. Must pass `npm run build` before reporting done.

---

## Inputs

- No args → pick the highest-value **unused** primary from `keywords.csv`.
- User-supplied keyword (e.g. `/blog plumbing tape`) → use that exact phrase. Verify it exists in `keywords.csv` and is not already in `references/used-keywords.md`. If it fails either check, stop and ask before proceeding.

---

## Read these files before doing anything

1. `CLAUDE.md` — project rules (SSG constraints, voice rules, design rules).
2. `project_specs.md`.
3. `on-page-seo.md` — every applicable item must be satisfied.
4. `references/voice.md` — sentence rhythm, banned words, "tells it's AI-written" checklist.
5. `references/humour.md` — every post must be funny; this defines how.
6. `references/stats.md` — only use numbers from here. Never round, never invent.
7. `references/stories.md` — one anecdote per post maximum. Don't invent new ones.
8. `references/opinions.md` — one strong opinion per post, backed by a number.
9. `references/used-keywords.md` — what's already taken.
10. `content/blog-voiced.ts` — the reference content shape and length.
11. `app/v5/page.tsx` — the template you will copy.

---

## Step-by-step workflow

### 1. Pick the primary keyword

Read `keywords.csv` and `references/used-keywords.md`.

If no arg:
- Parse the CSV, skip the header row.
- Drop any keyword that's already a primary in `used-keywords.md` (`plumber for low water pressure`, `plumber for running toilet`, `plumber baldwin park ca`, and any others added since).
- Drop any keyword with `Intent` = `Commercial` only (those are for `/service`) — we want `Informational` for blog posts.
- Rank remaining rows by `Volume / (KD + 1)` descending. Prefer keywords with SERP feature `People Also Ask` listed (means we can mine PAA questions for FAQs).
- Propose the top candidate to the user in one line: `Picking "<keyword>" (vol <V>, KD <KD>). Any objection?`
  - Auto mode: proceed immediately after announcing; do not wait for confirmation unless the user has expressed a strong preference earlier in the session.
  - Record the choice.

If arg supplied:
- Confirm it exists in the CSV (case-insensitive exact phrase match against the `Keyword` column).
- Confirm it is not in `used-keywords.md`.
- If either check fails → stop and ask.

### 2. Build the keyword cluster

Scan the CSV for **same-intent** secondaries (would someone searching this phrase want to land on the same page?). Max 5.

- Use CSV matches first (mark `✓ CSV`).
- Fill remaining slots with 4–5 invented secondaries from typical People-Also-Ask / Related-Searches patterns around the primary (mark `(invented)`). Keep to the same-intent rule.

### 3. Research the top-3 SERP

Use `WebSearch` with the primary keyword. From results:

- Pick the **top 3 organic results** (skip ads, featured snippets that don't link to a blog post, and domains that aren't blog posts — forums, Reddit, YouTube, directories).
- `WebFetch` each of the three. Extract:
  - **Format**: list / tutorial / guide / comparison / news.
  - **Word count** (rough, from body text). We'll target within 20% of the median.
  - **Every H2 topic they cover** — combined union across the three.
  - **Questions in any FAQ / People-Also-Ask blocks**.
- Add **1–2 extra topics** that none of the top-3 cover, but that a reader of the primary would value. Stealing ground they missed is the whole point.
- Note the dominant format → our post will match it (if top-3 are all "guides", we write a guide; if they're all "lists", we write a list).

### 4. Sanity-check voice and scope

Before writing: re-read `references/voice.md` sections "Tells that it's AI-written", "Words he never uses", and "Formatting rules". Keep that list beside you while drafting.

Plan:
- One story from `stories.md` (pick the most topical — do not invent).
- One opinion from `opinions.md` (pick the most topical — backed by a `stats.md` number).
- Real numbers only from `stats.md`.
- At least one "don't hire us for this" moment — biggest voice tell.
- Dad-joke pacing, deadpan. No exclamation marks. No emoji. No "unlock / leverage / seamless / world-class / in today's fast-paced world".

### 5. Fetch Pexels images

Images come from Pexels via `scripts/fetch-pexels.mjs`. API key: `PEXEL_API` in `.env`.

For each post you need:
- `hero` — landscape, matches the post topic.
- One image per H2 heading in the body — slug key matches the slugified H2 text exactly.
- `frequently-asked` — generic "question" image.
- `still-stuck-give-us-a-call` — generic "phone call" image.

Edit `scripts/fetch-pexels.mjs`: add a new entry under the `posts` object, keyed by slug. Each section key is the slugified H2 heading; each value is `{ query, alt }`. Follow the existing entries as the pattern.

Run:
```
node scripts/fetch-pexels.mjs
```

This writes images to `/public/images/blog/<slug>/` and appends attribution metadata to `/content/pexels.json`. Verify:
- Every expected key is present in the JSON.
- Files exist under `/public/images/blog/<slug>/`.
- No `✗` lines in the script output. If any failed, adjust the `query` (more concrete, single nouns work best) and rerun — the script is idempotent per section key.

### 6. Write the content file

Create `/content/blog-<slug>.ts`. Follow `content/blog-voiced.ts` exactly for shape:

```ts
export const <camelCaseSlug>Post = {
  slug: "<kebab-slug>",
  title: "<55–60 char title, primary keyword near start>",
  description: "<150–160 char meta description, primary keyword + benefit + soft CTA>",
  publishedAt: "<today YYYY-MM-DD>",
  readingMinutes: <rough number>,
  primaryKeyword: "<primary>",
  keywordCluster: ["<primary>", "<secondary 1>", "<secondary 2>", ...],
  author: {
    name: "Marco D'Agostino",
    role: "Owner, licensed plumber",
    licence: "VIC-PL-48217",
    years: 22,
    bio: "<from blog-voiced.ts — reuse verbatim>",
  },
  heroImageAlt: "<matches Pexels hero alt>",
  images: { /* mirror pexels.json keys for this slug */ },
  tldr: "<2–4 sentence direct answer to the query, reads well on its own>",
  body: `...markdown...`.trim(),
  faqs: [ /* 6–8 entries from People-Also-Ask, schema-ready */ ],
};
```

Body rules (compiled from `voice.md`, `humour.md`, `on-page-seo.md`):

- **Opener**: Funny-and-direct. Pub-neighbour voice. Set up → land → walk away.
- **Direct answer** in the first paragraph. Primary keyword in the first 100 words.
- **TL;DR** callout (rendered separately by the template — 2–4 sentences).
- **H2 hierarchy** mirrors the top-3 SERP consensus plus 1–2 novel sections. Each H2 is a statement, not a label ("Why is my toilet running? 5 causes" not "Causes").
- **Length** within 20% of the median SERP word count. Most plumbing "guide" SERPs are 1,800–2,500 words.
- **One story**, **one strong opinion**, **"when not to hire us"** moment.
- **Tables** for pricing and comparison. Use real numbers from `stats.md`.
- **3–5 internal links** to existing routes (`/v2/`, `/v3/`, `/v4/`, `/v5/`, `/v6/`, `/blog/`, `/services/`) or to other `/blog/<slug>/` posts if they exist. Anchor text is descriptive.
- **2–3 external links** to authoritative sources (.gov, industry bodies, Bunnings for parts). `target="_blank" rel="noopener nofollow"`.
- **FAQ section** with 6–8 entries. Source questions from People-Also-Ask and the top-3's FAQ blocks.
- **"Still stuck? Give us a call"** section at the end with phone number from `lib/business.ts`.

After drafting, re-read `voice.md` → "Tells that it's AI-written". Delete any paragraph that matches.

### 7. Create the route

Copy `app/v5/page.tsx` to `app/blog/<slug>/page.tsx`. Change:

- Import the new content file instead of `voicedPost`.
- Rename `images` lookup key to the new slug.
- `metadata.title.absolute` — post-specific, 55–60 chars.
- `metadata.description` — post-specific.
- `metadata.alternates.canonical` — `"/blog/<slug>/"`.
- `metadata.openGraph.url` — `"/blog/<slug>/"`.
- OG images path — `/images/blog/<slug>/hero.jpg`.
- `toc` array — rebuild from the new H2 structure (IDs must match `slugifyHeading` output — match what `BlogBody` emits).
- `BlogJsonLd` `slug` prop — `"blog/<slug>"`.
- Breadcrumbs `url` values — `"/blog/<slug>/"`.
- The "While you're here" internal-links card — swap in 2–3 relevant internal targets.
- The "Further reading" external links — swap in 2 relevant authoritative sources.

Make sure no SSG-breaking patterns land in the file (no `cookies()`, `headers()`, `searchParams`, no `dynamic = 'force-dynamic'`).

### 8. Update the blog index

Edit `app/blog/page.tsx`. Add a new entry to the `posts` array pointing at `/blog/<slug>/`. Pull `title`, `description`, `author.name`, `publishedAt`, `readingMinutes`, and the hero image from the new content file.

### 9. Mark the keyword used

Append a new section to `references/used-keywords.md` under "Active primaries" following the existing format. Include:

- Primary keyword + CSV source line (volume, KD).
- `/blog/<slug>/` as the page.
- Secondary cluster table with `✓ CSV` or `(invented)` source tags.
- CSV audit note.

### 10. Verify

Run:

```
npm run build
```

All routes must show `○ (Static)`. No build errors. Open the generated `out/blog/<slug>/index.html` (or run `npm run dev` and browse) and confirm:

- H1 renders with primary keyword.
- JSON-LD blocks are present for `Article`, `BreadcrumbList`, `FAQPage`, `Person`.
- Hero image renders.
- All H2 section images load.
- TOC anchors jump correctly.
- Phone number click-to-call works.
- No "AI tells" in the prose (re-run the voice checklist one more time).

If anything fails, fix and rebuild. Don't say "done" until the build is green and the page reads in voice.

---

## Output summary (report to user at the end)

- Primary keyword used + volume/KD.
- Cluster (5 secondaries).
- Top-3 SERP competitors referenced + their dominant format.
- Slug + URL: `/blog/<slug>/`.
- Files created/changed (bulleted).
- Build status.

Keep the summary to ~10 lines.

---

## Anti-patterns (do not do any of these)

- **Don't** invent a keyword that's not in `keywords.csv`.
- **Don't** reuse a primary from `used-keywords.md`.
- **Don't** skip `on-page-seo.md` items.
- **Don't** write without reading `voice.md` + `humour.md` first.
- **Don't** invent stats, stories, or opinions. Pull only from the reference files.
- **Don't** use exclamation marks, emoji, or any word on the "never use" list in `voice.md`.
- **Don't** ship without running `npm run build`.
- **Don't** touch `/app/v5/page.tsx` or `/content/blog-voiced.ts` — those are the canonical reference. Copy, don't mutate.
- **Don't** introduce runtime APIs, `dynamic = 'force-dynamic'`, or any SSG-breaking pattern.
