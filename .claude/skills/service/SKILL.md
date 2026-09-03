---
name: service
description: Generate a new city+service landing page. Picks an unused commercial-intent keyword from `Service-keywords.csv`, builds the local cluster, fetches Pexels images, renders with the `/v4` template, and marks the keyword used. Use when the user types `/service` or asks for a new service / landing page.
---

# `/service` — Service (city+service landing) page generator

Creates a production-ready, local-SEO-optimised landing page end-to-end. Output: a new route at `/app/services/<slug>/page.tsx`, a content file at `/content/landing-<slug>.ts`, downloaded Pexels images at `/public/images/services/<slug>/`, and updated `references/used-keywords.md`. Must pass `npm run build` before reporting done.

---

## Inputs

- No args → pick the highest-value **unused** primary from `Service-keywords.csv` (commercial intent wins).
- User-supplied keyword (e.g. `/service plumber arnold md`) → use that exact phrase. Verify it exists in `Service-keywords.csv` and is not already in `references/used-keywords.md`.

---

## Read these files before doing anything

1. `CLAUDE.md` — project rules (SSG constraints, voice rules, design rules).
2. `project_specs.md`.
3. `on-page-seo.md` — every applicable item must be satisfied, **especially the "Conversion Elements" section** (service pages only).
4. `references/voice.md` — sentence rhythm, banned words, "tells it's AI-written".
5. `references/humour.md` — service pages can be dryer, but still Marco's voice.
6. `references/stats.md` — pricing, response times, review numbers.
7. `references/opinions.md` — "we'll talk you out of hiring us" is a core trust signal.
8. `references/used-keywords.md` — skip anything already taken.
9. `content/landing-baldwin-park.ts` — reference content shape.
10. `app/v4/page.tsx` — the template you will copy.
11. `lib/business.ts` — Melbourne HQ data (only use this as a fallback; a city landing page needs **local NAP**).

---

## Step-by-step workflow

### 1. Pick the primary keyword

Read `Service-keywords.csv` and `references/used-keywords.md`.

If no arg:
- Parse CSV, skip header. Column order: `Database,Keyword,Seed keyword,Page,Topic,Page type,Tags,Volume,Keyword Difficulty,CPC (USD),Competitive Density,Number of Results,Intent,SERP Features,Trend,Click potential,Content references,Competitors`.
- Drop any keyword that's already a primary in `used-keywords.md`.
- Prefer `Intent` = `Commercial`. If none, fall back to any unused row.
- Rank by `CPC (USD)` descending (commercial intent: high CPC = high buyer value), tie-break by `Volume / (KD + 1)` descending.
- Announce: `Picking "<keyword>" (vol <V>, KD <KD>, CPC $<C>).` — in auto mode, proceed immediately after announcing.

If arg supplied:
- Confirm it exists in `Service-keywords.csv` (case-insensitive exact match).
- Confirm it is not in `used-keywords.md`.
- If either check fails → stop and ask.

### 2. Parse the location out of the keyword

City+service keywords take these shapes. Normalise:

- `plumber <city> <state>` → city = `<city>`, state = `<state uppercased 2-letter>`.
- `plumber in <city>` → city = `<city>`, state = inferred from context (ask if ambiguous).
- `plumbing in <city> <state>` → same as first pattern.
- `<city> plumber` → city = `<city>`.

Also derive:
- `stateFull` (e.g. `CA` → `California`, `MD` → `Maryland`, `IL` → `Illinois`).
- `county` — look this up with `WebSearch` (`"<city> <state> county"`) if you don't know it.
- `slug` = kebab-case of the keyword (e.g. `plumber-arnold-md`).

### 3. Build the keyword cluster

Same-intent local variations. Max 5. Use CSV matches first, then invented secondaries based on typical local-PAA patterns:

- `plumber in <city>`
- `<city> plumbing services`
- `emergency plumber <city>`
- `24 hour plumber <city>`
- `<city> <state> plumber` (if not the primary)

### 4. Research the top-3 local SERP

`WebSearch` the primary keyword. The top of a local SERP is usually the Google Local Pack — that's fine to note, but we're after the **organic** page structure we need to beat:

- `WebFetch` the top 3 organic (non-map) results. Extract:
  - Which services they list.
  - Which service areas / suburbs they cover.
  - Pricing transparency (almost always zero — our advantage).
  - Testimonial / review counts on page.
  - Presence of LocalBusiness / Plumber schema.
  - Whether they have an FAQ.
- Note any service the top 3 all skip — include it (stealing ground they missed is the whole point).

### 5. Draft the local NAP (Name, Address, Phone)

A city landing page **must** have local NAP or Google won't rank it. Since this is a demo project (no real branch), generate plausible placeholder data:

- `phone` — a realistic local-area-code number for the target city. Pattern `(NPA) NXX-NNNN`. `phoneE164` is `+1NPANXXNNNN`.
- `email` — `<city-slug>@plumbingco.com`.
- `address.street` — a realistic-sounding main-road address in the target city. Pull a plausible street name from `WebSearch` if needed.
- `address.suburb` — the city.
- `address.state`, `address.postcode`, `address.country` — filled.
- `licenseNumber` — construct a state-appropriate placeholder (e.g. California → `CA-C36-<7 digits>`, Maryland → `MD-MPL-<5 digits>`).
- `foundedLocal` — a year between 2012 and 2020.
- `jobsCompleted` — a number between 4,000 and 12,000.
- `review` — `{ rating: 4.8 or 4.9, count: 120–420, source: "Google" }`. Don't copy Melbourne HQ numbers (412 @ 4.9) — this is a different branch.
- `serviceAreas` — the target city plus 6–9 nearby suburbs (use `WebSearch` for "suburbs near <city>" if unknown).
- `hours` — match the Baldwin Park pattern unless the market clearly differs.

Mark these values in a comment at the top of the content file: `// Placeholder local NAP — demo only.`

### 6. Draft three testimonials

Follow the Baldwin Park pattern (see `content/landing-baldwin-park.ts`). Each:
- Concrete problem + concrete outcome.
- Real-sounding numbers (from `stats.md` price ranges).
- Local-sounding first-name + initial + suburb.
- Mentions a nearby suburb in the service-areas list, not always the primary city.

### 7. Fetch Pexels images

Edit `scripts/fetch-pexels.mjs`. Add a **new top-level block** after the `posts` object for service images — or reuse the existing mechanism by adding the slug under `posts` (the script doesn't care what the slug is, it just writes to `/public/images/blog/<slug>/`). For service pages we want the output under `/public/images/services/<slug>/`:

- **Preferred:** generalise the script. Rename the top-level var to `imageTargets` and add a `type` field per entry (`"blog"` or `"service"`); the script writes to `/public/images/<type>s/<slug>/`. Update `content/pexels.json` output to namespace: `{ blog: {...}, service: {...} }`. If this is more churn than you want, keep the simpler path (`/public/images/blog/<slug>/`) and reference the images from there — cosmetic only.
- For the service page we need fewer images than a blog:
  - `hero` — generic city-skyline or clean-plumbing-work image, landscape.
  - `service-drains`, `service-hot-water`, `service-leaks`, `service-burst` — one per feature card (optional, the v4 template uses SVG icons; if SVG is sufficient, skip these).
  - `testimonial-bg` — optional subtle background.

Run `node scripts/fetch-pexels.mjs` and verify output.

### 8. Write the content file

Create `/content/landing-<slug>.ts`. Follow `content/landing-baldwin-park.ts` exactly:

```ts
// <slug> — city+service landing page targeting "<primary keyword>".
// Placeholder local NAP — demo only.

export const <camelCaseSlug>Landing = {
  slug: "<slug>",
  city: "<City>",
  state: "<ST>",
  stateFull: "<Full State>",
  county: "<County>",
  primaryKeyword: "<primary>",
  keywordCluster: [ /* 5 entries */ ],
  phone: "(NPA) NXX-NNNN",
  phoneE164: "+1NPANXXNNNN",
  email: "<city-slug>@plumbingco.com",
  address: { street, suburb, state, postcode, country, formatted },
  licenseNumber: "...",
  foundedLocal: <year>,
  jobsCompleted: <number>,
  review: { rating, count, source: "Google" },
  serviceAreas: [ /* 7–10 */ ],
  hours: [ /* mon-fri, sat, sun */ ],
  testimonials: [ /* 3 */ ],
};

export type <PascalSlug>Landing = typeof <camelCaseSlug>Landing;
```

### 9. Create the route

Copy `app/v4/page.tsx` to `app/services/<slug>/page.tsx`. Change:

- Import the new content file instead of `baldwinParkLanding` (aliased as `loc`).
- `metadata.title.absolute` — post-specific, 55–60 chars.
- `metadata.description` — post-specific with local phone number.
- `metadata.alternates.canonical` — `"/services/<slug>/"`.
- `metadata.openGraph.url` and `locale` — set `locale` to match the country (`en_US` for US cities, `en_AU` for AU cities, etc.).
- All `loc.*` references stay since we aliased the import.
- Service card copy — if the top-3 SERP revealed a service they all emphasise (drain cleaning, repiping, sewer line), swap one of the feature cards to match.
- Testimonial section — references `loc.testimonials` already, nothing to change.
- Schema block at top — the `url` field in JSON-LD needs updating to `"https://<siteUrl>/services/<slug>/"` and the `"@type"` should stay `"Plumber"`.
- Breadcrumb at top — if v4 has no breadcrumb, add a `<Breadcrumbs>` component pointing `Home › Services › <City>`.

Make sure the page satisfies every "Conversion Elements" item from `on-page-seo.md`:
- [ ] **Primary CTA above the fold** — `tel:` click-to-call in the hero (already present in v4 — keep).
- [ ] **Multiple CTA placements** — hero, feature-grid cards, closing section.
- [ ] **Trust signals** — license, review count, years in business, jobs completed.
- [ ] **Testimonials with names**.
- [ ] **Service-area coverage** listed.
- [ ] **Business hours** displayed.
- [ ] **Physical address**.
- [ ] Consider an embedded Google Map iframe (lazy-loaded) if the v4 template doesn't already have one. If adding, use `loading="lazy"` and point at the full address.

SSG guard: no `cookies()`, `headers()`, `searchParams`, no `dynamic = 'force-dynamic'`.

### 10. Update the services index

Edit `app/services/page.tsx`. Add a new entry to the `services` array pointing at `/services/<slug>/` with a city-specific title (e.g. `"Plumber in Arnold, MD"`) and a short description.

### 11. Mark the keyword used

Append a section to `references/used-keywords.md` under "Active primaries" following the Baldwin Park pattern. Include primary with CSV source line, page path, full secondary cluster with `✓ CSV` or `(invented)` tags, and a CSV audit note.

### 12. Verify

```
npm run build
```

Every route must show `○ (Static)`. No build errors. View source of the generated HTML:

- `<title>` within 55–60 chars and contains the primary keyword.
- `<meta name="description">` within 150–160 chars.
- Hero has H1 containing the primary keyword.
- Local NAP (name, address, phone) is visible in the HTML (not hidden behind JS).
- JSON-LD `Plumber` schema block present with correct address, phone, aggregateRating, and openingHoursSpecification.
- `tel:` click-to-call links everywhere a phone number appears.
- Breadcrumb renders.
- No 404s on service-area links.

Run the site locally (`npm run dev`), browse `/services/<slug>/`, and check on mobile viewport that the CTA is thumb-reachable and no horizontal scroll exists.

---

## Output summary (report to user at the end)

- Primary keyword used + volume/KD/CPC.
- Cluster.
- Top-3 organic competitors + what they skip that we cover.
- Slug + URL: `/services/<slug>/`.
- Local NAP (phone, address).
- Files created/changed.
- Build status.

Keep to ~10 lines.

---

## Anti-patterns (do not do any of these)

- **Don't** invent a keyword that's not in `Service-keywords.csv`.
- **Don't** reuse a primary from `used-keywords.md`.
- **Don't** use Melbourne HQ's phone, address, or license on a US city page — local NAP is the single biggest local-SEO signal.
- **Don't** skip the `Plumber` LocalBusiness schema block.
- **Don't** skip any "Conversion Elements" item in `on-page-seo.md`.
- **Don't** write testimonials that invent services we don't offer or numbers that aren't in `stats.md`.
- **Don't** use "In today's fast-paced world", exclamation marks, emoji, or any banned word from `voice.md`.
- **Don't** ship without running `npm run build`.
- **Don't** touch `/app/v4/page.tsx` or `/content/landing-baldwin-park.ts` — those are the canonical reference. Copy, don't mutate.
- **Don't** introduce runtime APIs, `dynamic = 'force-dynamic'`, or any SSG-breaking pattern.
