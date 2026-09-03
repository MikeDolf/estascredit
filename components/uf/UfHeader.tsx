import Link from "next/link";
import { uralforklift as uf } from "@/lib/uralforklift";

export default function UfHeader() {
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/articles/" className="flex items-center gap-2.5" aria-label={uf.name}>
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-[11px] font-bold text-white"
          >
            УФ
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{uf.name}</span>
        </Link>
        <nav aria-label="Основная навигация" className="flex items-center gap-5 text-sm">
          <Link href="/articles/" className="text-ink/70 hover:text-ink">
            Статьи
          </Link>
          <a
            href={uf.contact.href}
            target="_blank"
            rel="noopener"
            className="btn-brand min-h-[48px] px-4 py-3"
          >
            {uf.contact.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
