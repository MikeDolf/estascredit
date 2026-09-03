import Link from "next/link";
import { uralforklift as uf } from "@/lib/uralforklift";

export default function UfFooter() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="container-x py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-lg font-bold tracking-tight">{uf.name}</div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/70">{uf.model}</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              Статьи
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/articles/vilochnyy-pogruzchik/" className="text-ink/75 hover:text-brand">
                  Вилочный погрузчик: виды и характеристики
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/kak-vybrat-vilochnyy-pogruzchik/"
                  className="text-ink/75 hover:text-brand"
                >
                  Как выбрать вилочный погрузчик
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              Связаться
            </div>
            <p className="mt-3 text-sm text-ink/75">
              Пишите в {uf.contact.channel} — опишите задачу словами, характеристики посчитаю сам.
            </p>
            <a
              href={uf.contact.href}
              target="_blank"
              rel="noopener"
              className="btn-brand mt-4 inline-flex min-h-[48px] items-center px-4 py-3"
            >
              {uf.contact.label}
            </a>
            <p className="mt-4 text-xs text-ink/60">
              {uf.legalForm}. База — {uf.baseRegion}, работаем по всей стране.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
