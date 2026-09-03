#!/usr/bin/env node
/**
 * Fetches a hero image + one image per H2 section for each blog post.
 * Saves to /public/images/blog/<post-slug>/<section-slug>.jpg
 * Writes attribution metadata to /content/pexels.json
 *
 * Run:  node scripts/fetch-pexels.mjs
 * Env:  PEXEL_API (or PEXELS_API_KEY) — loaded from .env / .env.local
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const txt = await fs.readFile(path.join(root, file), "utf8");
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
        if (m) process.env[m[1]] ??= m[2].replace(/^"(.*)"$/, "$1");
      }
    } catch {}
  }
}

// Image targets. Section keys must match slugifyHeading() output in lib/markdown.ts.
const posts = {
  "plumber-for-running-toilet": {
    hero: { query: "modern bathroom toilet clean", alt: "Modern clean white toilet in a bright bathroom" },
    "why-is-my-toilet-running-the-5-common-causes": { query: "toilet tank interior mechanism", alt: "Open toilet cistern showing the internal mechanism" },
    "signs-you-have-a-running-toilet-beyond-the-obvious-noise": { query: "water meter residential gauge", alt: "Residential water meter with flow indicator" },
    "tools-youll-need": { query: "plumbing tools workbench", alt: "Plumbing tools laid out on a workbench" },
    "how-to-stop-a-running-toilet-step-by-step": { query: "plumber toilet cistern repair", alt: "Plumber working on a toilet cistern" },
    "toilet-flapper-replacement-the-20-fix": { query: "plumbing parts workshop", alt: "Assorted plumbing parts on a workbench" },
    "fill-valve-replacement-if-the-flapper-isnt-it": { query: "toilet fill valve open tank", alt: "Toilet fill valve inside an open cistern" },
    "when-to-call-a-plumber": { query: "plumber working bathroom professional", alt: "Licensed plumber working under a bathroom fixture" },
    "how-much-to-fix-a-running-toilet-honest-numbers": { query: "calculator invoice desk", alt: "Calculator and invoice on a desk" },
    "how-much-water-does-a-running-toilet-waste": { query: "running water tap waste", alt: "Water running from a tap" },
    "two-things-most-other-guides-miss": { query: "dual flush toilet buttons", alt: "Dual-flush buttons on a modern toilet" },
    "frequently-asked": { query: "woman thinking at home", alt: "Homeowner thinking at a kitchen counter" },
    "still-stuck-give-us-a-call": { query: "phone call help home", alt: "Person on a phone call at home" },
  },
  "plumber-for-low-water-pressure": {
    hero: { query: "shower head water flow", alt: "Close-up of a shower head with water flowing" },
    "understanding-the-problem": { query: "dripping faucet closeup", alt: "Dripping kitchen faucet close-up" },
    "why-is-my-water-pressure-low": { query: "bathroom sink water running", alt: "Water flowing from a bathroom sink tap" },
    "how-to-fix-low-water-pressure": { query: "pipe wrench plumbing", alt: "Pipe wrench and plumbing tools" },
    "low-water-pressure-in-whole-house": { query: "house exterior water meter", alt: "Residential house exterior" },
    "how-much-does-it-cost-to-fix-low-water-pressure": { query: "invoice money desk", alt: "Invoice and money on a desk" },
    "why-choose-us": { query: "plumber team smiling", alt: "Professional plumbing team" },
    "conclusion": { query: "modern kitchen faucet clean", alt: "Modern clean kitchen faucet" },
  },
};

async function searchPexels(apiKey, query) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "5");
  url.searchParams.set("size", "medium");
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.photos?.length) throw new Error("no results");
  return data.photos[0];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.PEXEL_API || process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Missing PEXEL_API (or PEXELS_API_KEY) in .env/.env.local");
    process.exit(1);
  }

  const attributions = {};
  let ok = 0;
  let fail = 0;

  for (const [postSlug, sections] of Object.entries(posts)) {
    const postDir = path.join(root, "public", "images", "blog", postSlug);
    await fs.mkdir(postDir, { recursive: true });
    attributions[postSlug] = {};

    for (const [sectionKey, cfg] of Object.entries(sections)) {
      process.stdout.write(`→ ${postSlug}/${sectionKey}  "${cfg.query}" ... `);
      try {
        const photo = await searchPexels(apiKey, cfg.query);
        const srcUrl = photo.src.large || photo.src.medium || photo.src.original;
        const dest = path.join(postDir, `${sectionKey}.jpg`);
        const bytes = await download(srcUrl, dest);
        attributions[postSlug][sectionKey] = {
          file: `/images/blog/${postSlug}/${sectionKey}.jpg`,
          alt: cfg.alt,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          pexelsUrl: photo.url,
          width: photo.width,
          height: photo.height,
        };
        console.log(`✓ ${(bytes / 1024).toFixed(0)} KB — ${photo.photographer}`);
        ok++;
      } catch (err) {
        console.log(`✗ ${err.message}`);
        fail++;
      }
    }
  }

  const out = path.join(root, "content", "pexels.json");
  await fs.writeFile(out, JSON.stringify(attributions, null, 2));
  console.log(`\n${ok} images downloaded, ${fail} failed`);
  console.log(`Wrote ${path.relative(root, out)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
