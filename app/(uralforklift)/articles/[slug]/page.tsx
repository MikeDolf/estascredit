import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleJsonLd from "@/components/uf/ArticleJsonLd";
import UfFigure from "@/components/uf/UfFigure";
import UfAuthorCard from "@/components/uf/UfAuthorCard";
import UfBackToTop from "@/components/uf/UfBackToTop";
import { renderMarkdown } from "@/lib/markdown";
import { articles, getArticle, linkOnlyPublished } from "@/content/uralforklift-articles";
import { uralforklift as uf } from "@/lib/uralforklift";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const path = `/articles/${a.slug}/`;
  const ogImage = {
    url: `/og/${a.slug}.png`,
    width: 1200,
    height: 630,
    alt: a.ogTitle,
  };

  return {
    // absolute — чтобы шаблон лейаута не приклеивал название второй раз
    title: { absolute: `${a.metaTitle} · ${uf.name}` },
    description: a.metaDescription,
    keywords: a.keywordCluster,
    authors: [{ name: uf.author.name, url: `${uf.siteUrl}${uf.author.url}` }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: a.ogTitle,
      description: a.ogDescription,
      url: path,
      siteName: uf.name,
      locale: uf.locale,
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      authors: [uf.author.name],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: a.ogTitle,
      description: a.twitterDescription,
      images: [`/og/${a.slug}.png`],
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return null;

  const others = articles.filter((x) => x.slug !== a.slug);
  const toc = [
    ...a.sections.map((s) => ({ id: s.id, label: s.tocLabel })),
    { id: "faq", label: "Частые вопросы" },
  ];

  return (
    <>
      <ArticleJsonLd article={a} />

      <article className="container-x pb-20 pt-10 md:pt-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Статьи", href: "/articles/" },
              { label: a.metaTitle },
            ]}
          />

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tightest md:text-5xl">
            {a.h1}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink/60">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-bold text-white"
              >
                {uf.author.initials}
              </span>
              <span>
                <span className="block font-medium text-ink">{uf.author.name}</span>
                <span className="block text-xs">{uf.author.role}</span>
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>
              Опубликовано{" "}
              <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>
              Обновлено <time dateTime={a.updatedAt}>{formatDate(a.updatedAt)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>{a.readingMinutes} мин чтения</span>
          </div>

          <UfFigure image={a.hero} priority />

          <div className="prose-plumb">{renderMarkdown(linkOnlyPublished(a.intro))}</div>

          <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-soft/60 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
              Коротко
            </h2>
            <ul className="mt-3 space-y-2 text-[1.02rem] leading-relaxed text-ink/85">
              {a.tldr.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <TableOfContents items={toc} label="Содержание" />
          </div>

          {a.sections.map((s) => (
            <section key={s.id} className="prose-plumb">
              <h2 id={s.id}>{s.heading}</h2>
              {s.image && <UfFigure image={s.image} />}
              {renderMarkdown(linkOnlyPublished(s.body))}
            </section>
          ))}

          <section id="faq" className="mt-14">
            <h2 className="font-display text-2xl font-bold tracking-tightest md:text-3xl">
              Частые вопросы
            </h2>
            <dl className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white shadow-card">
              {a.faqs.map((f) => (
                <div key={f.q} className="p-6">
                  <dt className="font-display text-base font-bold tracking-tight md:text-lg">
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 rounded-3xl border border-ink/10 bg-white p-7 shadow-card">
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
              Опишите задачу — посчитаю, что вам нужно
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              {uf.model} Напишите, что возите, сколько весит и куда ставите. Список характеристик
              собирать заранее не нужно — вопросы задам я. Если из задачи выйдет, что покупать не
              надо, скажу и это.
            </p>
            <a
              href={uf.contact.href}
              target="_blank"
              rel="noopener"
              className="btn-brand mt-5 inline-flex min-h-[48px] items-center px-5 py-3"
            >
              {uf.contact.label}
            </a>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-bold tracking-tight">Читать дальше</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {others.map((o) => (
                <li key={o.slug} className="flex items-start gap-3">
                  <span aria-hidden className="mt-1 text-brand">
                    →
                  </span>
                  <Link
                    href={`/articles/${o.slug}/`}
                    className="font-medium text-brand underline-offset-4 hover:underline"
                  >
                    {o.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 text-xs leading-relaxed text-ink/70">
            <span className="font-medium text-ink/80">Источники: </span>
            {a.sources.map((s, i) => (
              <span key={s.href}>
                {i > 0 && " · "}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="text-ink/85 underline-offset-4 hover:text-ink hover:underline"
                  title={s.note}
                >
                  {s.note} — {s.label}
                </a>
              </span>
            ))}
          </div>

          <div className="mt-12">
            <UfAuthorCard />
          </div>

          <UfBackToTop />
        </div>
      </article>
    </>
  );
}
