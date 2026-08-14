#!/usr/bin/env python3
"""Сборка сетки товар × город.

    python3 _build/build.py            — собрать все пары
    python3 _build/build.py --pilot    — только пары с уникальным текстом

Принципы (раздел 3 мастер-промпта):
  · данные отдельно от шаблонов — в шаблоне нет ни одного предложения,
    которое зависит от товара, иначе оно одинаково на всех страницах;
  · один источник истины на факт;
  · сборка падает громко: дубль URL — это assert, а не тихая перезапись;
  · карты сайта строятся из результата сборки, а не правятся руками.
"""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from data import city_product, market, site_config as cfg
from data.cities import CITIES, BY_SLUG as CITY_BY_SLUG
from data.products import PRODUCTS, BY_SLUG as PROD_BY_SLUG, ROLLOUT_ORDER

ROOT = Path(__file__).resolve().parent.parent
TPL_DIR = Path(__file__).parent / "templates"
TEMPLATE = (TPL_DIR / "product_city.html").read_text("utf-8")
TEMPLATE_HUB = (TPL_DIR / "product_hub.html").read_text("utf-8")

# Страницы, написанные руками. Сборка их не трогает, но учитывает в sitemap.
HAND_WRITTEN = [
    "/", "/articles/",
    "/articles/kak-vybrat-ekskavator-iz-kitaya.html",
    "/articles/rastamozhka-spectehniki-2026.html",
    "/articles/lizing-spectehniki-dlya-yurlic.html",
]


def render(tpl: str, ctx: dict) -> str:
    out = re.sub(r"\{\{\s*(\w+)\s*\}\}", lambda m: str(ctx.get(m.group(1), "")), tpl)
    left = re.findall(r"\{\{\s*(\w+)\s*\}\}", out)
    assert not left, f"В шаблоне остались незаполненные поля: {set(left)}"
    return out


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def shuffle(seq, seed: str):
    """Детерминированная перетасовка: без неё первые по алфавиту города
    собирают все входящие ссылки, а новые страницы — ни одной."""
    return sorted(seq, key=lambda x: hashlib.md5((seed + str(x)).encode()).hexdigest())


def build_body(p, c) -> str:
    """Основной текст. Уникальный абзац идёт ПЕРВЫМ."""
    parts = []
    uniq = city_product.get_note(c.slug, p.slug)
    if uniq:
        parts.append(f"<p>{esc(uniq)}</p>")

    parts.append(
        f"<p>Поставляем {esc(p.acc)} из Китая {esc(c.loc)} под ключ: подбираем модель "
        f"под задачу, заключаем договор, проверяем технику на заводе перед отгрузкой, "
        f"берём на себя таможенное оформление и доставку до вашей площадки.</p>"
    )

    if p.used_for:
        items = "".join(f"<li>{esc(x)}</li>" for x in p.used_for)
        parts.append(f"<h2>Для чего берут {esc(p.acc)}</h2><ul>{items}</ul>")

    if p.variants or p.tonnage:
        parts.append(f"<h2>Что уточнить до заказа</h2>")
        rows = []
        if p.tonnage:
            rows.append(f"<li><strong>Грузоподъёмность или класс:</strong> {esc(', '.join(p.tonnage))}. "
                        f"Ошибка в этом параметре дороже всего: маленькая машина не тянет "
                        f"объём, крупная простаивает и жжёт топливо.</li>")
        if p.variants:
            rows.append(f"<li><strong>Исполнение:</strong> {esc(', '.join(p.variants))}. "
                        f"Выбор зависит от того, где техника работает физически.</li>")
        if p.brands:
            rows.append(f"<li><strong>Завод:</strong> работаем с {esc(', '.join(p.brands))} и другими. "
                        f"От бренда зависит доступность запчастей, а не только цена.</li>")
        parts.append("<ul>" + "".join(rows) + "</ul>")

    parts.append(
        f"<h2>Стоимость поставки {esc(c.loc)}</h2>"
        f"<p>Итоговая цена складывается из четырёх частей: {esc(', '.join(market.PRICE_COMPONENTS))}. "
        f"Каждая зависит от конкретной модели, поэтому точную сумму называем по заявке — "
        f"с разбивкой по всем статьям, без скрытых доплат на этапе растаможки.</p>"
    )
    if not cfg.OWN_PRICES_CONFIRMED:
        parts.append("<!-- Блок цен не выводится: site_config.OWN_PRICES_CONFIRMED = False -->")

    if cfg.DELIVERY_DAYS:
        lo, hi = cfg.DELIVERY_DAYS
        parts.append(f"<h2>Сроки</h2><p>От подписания договора до прибытия {esc(c.gen)} — "
                     f"{lo}–{hi} дней. Точный срок фиксируется в договоре.</p>")

    return "\n        ".join(parts)


def build_faq(p, c) -> str:
    qa = city_product.get_faq(c.slug, p.slug)
    if not qa:
        return ""
    items = []
    for i, (q, a) in enumerate(qa):
        open_cls = " open" if i == 0 else ""
        items.append(
            f'<div class="faq-item{open_cls}">'
            f'<button class="faq-q" type="button"><span>{esc(q)}</span><span class="plus">+</span></button>'
            f'<div class="faq-a"><p>{esc(a)}</p></div></div>'
        )
    return "<h2 style=\"margin-bottom:8px;\">Частые вопросы</h2>" + "".join(items)


def nav_label(product, city) -> str:
    """Подпись ссылки строится ТОЛЬКО по ключу товара и города.

    Именно здесь на первом проекте появились 45 несоответствий: подпись брали
    из общего вспомогательного поля, и ссылка на общую страницу подписывалась
    именем частной — поисковик считал страницы одинаковыми.
    """
    return f"{product.nom.capitalize()} {city.loc}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pilot", action="store_true",
                    help="собрать только пары с уникальным текстом")
    args = ap.parse_args()

    pairs = [(c, p) for p in PRODUCTS for c in CITIES]
    if args.pilot:
        pairs = [(c, p) for c, p in pairs if city_product.get_note(c.slug, p.slug)]

    # Перелинковка строится только по страницам, которые собираются в этом
    # прогоне: иначе пилот уезжает в публикацию со ссылками на 404.
    in_build = {(c.slug, p.slug) for c, p in pairs}

    seen: dict[str, tuple[str, str]] = {}
    written: list[str] = []

    for c, p in pairs:
        url = f"/{p.slug}-iz-kitaya-{c.slug}/"
        assert url not in seen, f"Дубль URL {url}: {seen[url]} и {(c.slug, p.slug)}"
        seen[url] = (c.slug, p.slug)

        h1 = f"{p.nom.capitalize()} из Китая {c.loc}"
        title = f"{h1} — купить с доставкой и растаможкой | {cfg.BRAND}"
        desc = (f"Поставка {p.gen} из Китая {c.loc} под ключ: подбор модели, "
                f"контракт с заводом, инспекция перед отгрузкой, растаможка и доставка.")

        # Перелинковка: другие города того же товара + другие товары этого города.
        other_cities = shuffle([x for x in CITIES
                                if x.slug != c.slug and (x.slug, p.slug) in in_build],
                               p.slug)[:6]
        other_products = shuffle([x for x in PRODUCTS
                                  if x.slug != p.slug and (c.slug, x.slug) in in_build],
                                 c.slug)[:5]
        links = " · ".join(
            f'<a href="/{p.slug}-iz-kitaya-{x.slug}/">{esc(nav_label(p, x))}</a>'
            for x in other_cities)
        def foot_col(title: str, items: str) -> str:
            # Пустую колонку в футер не выводим: в пилоте соседних страниц
            # ещё нет, и заголовок без списка выглядит как недоделка.
            return (f'<div class="foot-col"><h4>{esc(title)}</h4><ul>{items}</ul></div>'
                    if items else "")

        foot_cities_block = foot_col(p.plural.capitalize(), "".join(
            f'<li><a href="/{p.slug}-iz-kitaya-{x.slug}/">{esc(nav_label(p, x))}</a></li>'
            for x in other_cities))
        foot_products_block = foot_col(c.nom, "".join(
            f'<li><a href="/{x.slug}-iz-kitaya-{c.slug}/">{esc(nav_label(x, c))}</a></li>'
            for x in other_products))

        graph = [
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Главная", "item": cfg.BASE_URL + "/"},
                {"@type": "ListItem", "position": 2, "name": h1, "item": cfg.BASE_URL + url},
            ]},
            {"@type": "LocalBusiness", "name": cfg.BRAND, "url": cfg.BASE_URL,
             "areaServed": c.nom},
        ]
        faq_pairs = city_product.get_faq(c.slug, p.slug)
        if faq_pairs:
            # Вопросы в разметке — те же, что видны на странице.
            # Расхождение видимого и размеченного — нарушение правил Яндекса.
            graph.append({"@type": "FAQPage", "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faq_pairs]})

        html = render(TEMPLATE, {
            "title": esc(title), "description": esc(desc), "canonical": cfg.BASE_URL + url,
            "h1": esc(h1), "city_nom": esc(c.nom), "city_loc": esc(c.loc),
            "product_gen": esc(p.gen),
            "product_plural_title": esc(p.plural.capitalize()),
            "body": build_body(p, c), "faq": build_faq(p, c),
            "links": links,
            "foot_cities_block": foot_cities_block,
            "foot_products_block": foot_products_block,
            "root": "../", "asset_version": cfg.ASSET_VERSION,
            "brand": cfg.BRAND, "tagline": cfg.BRAND_TAGLINE,
            "contact_link": cfg.CONTACT_LINK,
            "work_hours": cfg.WORK_HOURS,
            "jsonld": json.dumps({"@context": "https://schema.org", "@graph": graph},
                                 ensure_ascii=False, separators=(",", ":")),
        })

        out = ROOT / url.strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, "utf-8")
        written.append(url)

    # --- страницы-хабы направлений ---
    # Без хаба сетка городов висит в воздухе: из каталога на неё не попасть,
    # и внутренний вес на неё не течёт.
    for p in PRODUCTS:
        cities = [c for c in CITIES if (c.slug, p.slug) in in_build]
        if not cities:
            continue
        url = f"/{p.slug}-iz-kitaya/"
        assert url not in seen, f"Дубль URL {url}"
        seen[url] = ("hub", p.slug)

        h1 = f"{p.plural.capitalize()} из Китая"
        title = f"{h1} — поставка под ключ с растаможкой | {cfg.BRAND}"
        desc = (f"Поставка {p.gen} из Китая под ключ: подбор по задаче, контракт "
                f"с заводом, инспекция перед отгрузкой, растаможка и доставка "
                f"в {len(cities)} городов России.")

        body = [
            f"<p>Возим {esc(p.acc)} напрямую с китайских заводов: подбираем модель "
            f"под условия работы, заключаем договор, проверяем технику перед "
            f"отгрузкой и берём на себя таможенное оформление. Заказчик получает "
            f"машину на своей площадке с полным комплектом документов.</p>"
        ]
        if p.used_for:
            body.append("<h2>Типовые задачи</h2><ul>"
                        + "".join(f"<li>{esc(x)}</li>" for x in p.used_for) + "</ul>")
        if p.tonnage:
            body.append(f"<h2>Что подбираем</h2><p><strong>Грузоподъёмность:</strong> "
                        f"{esc(', '.join(p.tonnage))}.</p>")
            if p.variants:
                body.append(f"<p><strong>Исполнение:</strong> {esc(', '.join(p.variants))}. "
                            f"Выбор диктуется тем, где машина работает физически, "
                            f"а не бюджетом: под закрытое помещение, мороз или "
                            f"запылённую площадку подходят разные варианты.</p>")
            if p.brands:
                body.append(f"<p><strong>Заводы:</strong> {esc(', '.join(p.brands))} и другие. "
                            f"Массовый бренд выигрывает не ценой, а доступностью "
                            f"запчастей — узел под редкую модель едет из Китая неделями.</p>")
        body.append(f"<h2>Стоимость</h2><p>Складывается из четырёх частей: "
                    f"{esc(', '.join(market.PRICE_COMPONENTS))}. Считаем по заявке "
                    f"с разбивкой по всем статьям — без доплат, всплывающих "
                    f"на этапе растаможки.</p>")

        cards = "".join(
            f'<a class="article-card" href="/{p.slug}-iz-kitaya-{c.slug}/">'
            f'<div class="body"><span class="date">{esc(c.region)}</span>'
            f'<h3>{esc(nav_label(p, c))}</h3>'
            f'<span class="readmore">Подробнее →</span></div></a>'
            for c in shuffle(cities, p.slug))

        hub_graph = [
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Главная", "item": cfg.BASE_URL + "/"},
                {"@type": "ListItem", "position": 2, "name": h1, "item": cfg.BASE_URL + url},
            ]},
            # Для категории правильный шаблон — ItemList, а не Product:
            # Product обещал бы конкретный товар с ценой, которого здесь нет.
            {"@type": "ItemList", "name": h1, "numberOfItems": len(cities),
             "itemListElement": [
                 {"@type": "ListItem", "position": i,
                  "name": nav_label(p, c), "url": f"{cfg.BASE_URL}/{p.slug}-iz-kitaya-{c.slug}/"}
                 for i, c in enumerate(cities, 1)]},
            {"@type": "LocalBusiness", "name": cfg.BRAND, "url": cfg.BASE_URL},
        ]

        html = render(TEMPLATE_HUB, {
            "title": esc(title), "description": esc(desc), "canonical": cfg.BASE_URL + url,
            "h1": esc(h1), "product_acc": esc(p.acc),
            "city_count": f"{len(cities)} городов доставки",
            "body": "\n        ".join(body), "city_cards": cards,
            "foot_cities_block": (
                f'<div class="foot-col"><h4>{esc(p.plural.capitalize())}</h4><ul>'
                + "".join(f'<li><a href="/{p.slug}-iz-kitaya-{c.slug}/">{esc(c.nom)}</a></li>'
                          for c in shuffle(cities, p.slug)[:6]) + "</ul></div>"),
            "root": "../", "asset_version": cfg.ASSET_VERSION,
            "brand": cfg.BRAND, "tagline": cfg.BRAND_TAGLINE,
            "contact_link": cfg.CONTACT_LINK,
            "work_hours": cfg.WORK_HOURS,
            "jsonld": json.dumps({"@context": "https://schema.org", "@graph": hub_graph},
                                 ensure_ascii=False, separators=(",", ":")),
        })
        out = ROOT / url.strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, "utf-8")
        written.append(url)

    # --- sitemap строго из результата сборки ---
    urls = HAND_WRITTEN + written
    assert len(urls) == len(set(urls)), "Дубли URL в sitemap"
    body = "".join(
        f"  <url><loc>{cfg.BASE_URL}{u}</loc><changefreq>weekly</changefreq></url>\n"
        for u in urls)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}</urlset>\n", "utf-8")

    print(f"Собрано страниц: {len(written)}   всего в sitemap: {len(urls)}")
    cov = city_product.coverage([(c.slug, p.slug) for c, p in
                                 [(c, p) for p in PRODUCTS for c in CITIES]])
    print("Уникализация:", ", ".join(f"{k}={v}" for k, v in cov.items()))

    gaps = cfg.missing_facts()
    if gaps:
        print("\nНЕЗАКРЫТАЯ ФАКТУРА (эти блоки на страницы не выводятся):")
        for g in gaps:
            print("  •", g)
    return 0


if __name__ == "__main__":
    sys.exit(main())
