#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Сборка статических страниц estascredit.ru (УралФорклифт).

    python3 _build/build.py            обычная сборка
    python3 _build/build.py --all      собрать и неуникализированные гео-страницы
                                        как индексируемые (осознанный риск)

Зачем генератор. Шапка, подвал, меню и SEO-обвязка одинаковы на всех
страницах. Без сборки правка одного пункта меню — это правка полутора десятков
файлов, и рано или поздно один из них отстанет. Здесь всё это лежит в одном
месте, а страницы — производные.

Что скрипт НЕ делает намеренно:

  * не размечает товары через schema.org/Product и Offer. Сейчас все позиции —
    образцы с условными ценами; отдать такую цену в поисковую выдачу значит
    показать человеку число, которого не существует. Разметку товаров
    включаем вместе с реальным прайсом.
  * не выводит пустые блоки. Нет фактуры — нет заголовка с пустотой под ним.
  * не индексирует гео-страницы без собственного текста: пока `unique` пуст,
    страница собирается с noindex и не попадает в sitemap.
"""

import html
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from data.site import SITE, NAV, FOOTER_COMPANY, FOOTER_LEGAL, FORBIDDEN_WORDING
from data.catalog import CATEGORIES, LIFT_RANGES, TONNAGE_CHIPS, LEAD_TYPES, BRANDS
from data.pages import TRUST_PAGES, LEGAL_PAGES
from data.articles import ARTICLES
from markdown_lite import convert as md_to_html
from data import cities as cities_data

ROOT = Path(__file__).resolve().parent.parent
TPL = Path(__file__).resolve().parent / "templates"


# Версия статики в query-строке: меняйте, когда правите css/js, иначе у
# посетителей останется закешированная старая версия.
VER = "29"

FORKLIFT_SVG = (
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="{w}" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<rect x="16" y="62" width="52" height="10" rx="5"/>'
    '<circle cx="28" cy="78" r="8"/><circle cx="56" cy="78" r="8"/>'
    '<path d="M24 62 L24 46 L52 46 L62 34 L76 34 L76 54 L62 62 Z"/>'
    '<rect x="30" y="38" width="16" height="12"/></svg>'
)

# Силуэт погрузчика заливкой, а не обводкой: на 38 px тонкие линии сливаются,
# сплошные фигуры читаются. Машина смотрит влево — как на фотографиях в каталоге.
LOGO_SVG = (
    '<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">'
    '<rect x="44" y="14" width="46" height="7" rx="2"/>'      # дуга безопасности
    '<rect x="83" y="14" width="7" height="38"/>'             # задняя стойка
    '<rect x="44" y="14" width="7" height="26"/>'             # передняя стойка
    '<rect x="28" y="10" width="7" height="66"/>'             # мачта
    '<rect x="21" y="40" width="6" height="36"/>'             # каретка
    '<rect x="4" y="70" width="24" height="6"/>'              # вилы
    '<path d="M40 76 V54 h12 l5-10 h26 a5 5 0 0 1 5 5 V76 Z"/>'  # корпус
    '<circle cx="50" cy="80" r="9"/><circle cx="78" cy="80" r="9"/>'
    '</svg>'
)

MAX_SVG = (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 '
    '3.6 11.5a8.4 8.4 0 0 1 8.4-8.4h.5a8.4 8.4 0 0 1 8.5 8.4z"/></svg>'
)


def e(text):
    """Экранирование для вставки в атрибут или текст."""
    return html.escape(str(text or ""), quote=True)


def money(value):
    return "{:,}".format(int(value)).replace(",", " ") + " ₽"


def root_prefix(slug):
    """`../` столько раз, сколько уровней вложенности у страницы."""
    if not slug:
        return ""
    return "../" * len(slug.strip("/").split("/"))


def max_link(css_class="contact-max"):
    return (
        '<a class="{cls}" href="{url}" target="_blank" rel="noopener" '
        'aria-label="Связаться в MAX">{svg}MAX</a>'
    ).format(cls=css_class, url=e(SITE["max_url"]), svg=MAX_SVG)


# --------------------------------------------------------------------------
# Шапка и подвал
# --------------------------------------------------------------------------

def render_logo(root, href=None):
    href = href if href is not None else root + "index.html"
    return (
        '<a href="{href}" class="logo">'
        '<span class="mark">{svg}</span>'
        '<div>{name}<small>{tagline}</small></div></a>'
    ).format(href=e(href), svg=LOGO_SVG, name=e(SITE["name"]), tagline=e(SITE["tagline"]))


def render_header(root, slug, has_form):
    links = []
    for label, href in NAV:
        # На самой главной ссылка вида index.html#catalog перезагружает
        # страницу вместо прокрутки — оставляем чистый якорь.
        if not slug and href.startswith("index.html#"):
            href = href[len("index.html"):]
        target = href.split("#")[0].rstrip("/")
        active = " class=\"active\"" if target and slug.startswith(target) else ""
        links.append('<a href="{}"{}>{}</a>'.format(e(root + href), active, e(label)))

    # Слева в верхней строке — регион работы, справа канал связи. Телефона
    # на сайте нет, пока он не появится в data/site.py.
    topbar_left = "Подбор вилочных погрузчиков · {}".format(SITE["region"])
    hours = SITE["opening_hours"]

    # Телефон рядом с кнопкой: часть покупателей звонит, а не заполняет форму.
    # На десктопе он живёт в тонкой строке сверху (тут достаточно места),
    # на планшете/мобильном — эта строка скрыта, и телефон переезжает в
    # navrow, оставаясь дотягиваемым в один тап (см. медиа-запрос 1180px).
    phone_block = ""
    tb_phone = ""
    nav_phone = ""
    if SITE["phone"]:
        phone_block = (
            '<a class="phone-block" href="tel:{href}">'
            '<span class="num">{num}</span>'
            '<span class="hrs">{hrs}</span></a>'
        ).format(href=e(SITE["phone_href"]), num=e(SITE["phone"]),
                 hrs=e(SITE["opening_hours"] or "Звоните по рабочим дням"))
        tb_phone = '<a class="tb-phone" href="tel:{href}">{num}</a>'.format(
            href=e(SITE["phone_href"]), num=e(SITE["phone"]))
        nav_phone = '<a class="nav-cta-phone" href="tel:{href}">{num}</a>'.format(
            href=e(SITE["phone_href"]), num=e(SITE["phone"]))

    tb_email = ""
    if SITE["email"]:
        tb_email = '<a class="tb-email" href="mailto:{0}">{0}</a>'.format(e(SITE["email"]))

    return (
        '<header>\n'
        '  <div class="topbar">\n'
        '    <span>{left}</span>\n'
        '    <div class="tb-right">\n'
        '      {tb_phone}\n'
        '      {tb_email}\n'
        '      <span>{hours}</span>\n'
        '      <span>{max}</span>\n'
        '    </div>\n'
        '  </div>\n'
        '  <div class="navrow">\n'
        '    {logo}\n'
        '    <nav class="mainnav" id="mainnav">\n'
        '      {links}\n'
        '      {nav_phone}\n'
        '      <a href="{cta}" class="nav-cta btn btn-primary">Оставить заявку</a>\n'
        '    </nav>\n'
        '    <div class="nav-right">\n'
        '      {phone}\n'
        '      <a href="{cta}" class="btn btn-primary">Оставить заявку</a>\n'
        '      <button class="burger" type="button" aria-label="Меню" aria-expanded="false" '
        'aria-controls="mainnav"><span></span></button>\n'
        '    </div>\n'
        '  </div>\n'
        '  <div class="hazard-bar"></div>\n'
        '</header>'
    ).format(
        left=e(topbar_left),
        tb_phone=tb_phone,
        tb_email=tb_email,
        hours=e(hours),
        max=max_link(),
        logo=render_logo(root),
        links="\n      ".join(links),
        nav_phone=nav_phone,
        phone=phone_block,
        # На странице без формы вести на #lead нельзя — якоря там нет.
        cta="#lead" if has_form else e(root + "kontakty/"),
    )


def render_footer(root):
    catalog_links = "\n          ".join(
        '<li><a href="{}catalog/{}/">{}</a></li>'.format(e(root), e(c["slug"]), e(c["name"]))
        for c in CATEGORIES
    )
    company_links = "\n          ".join(
        '<li><a href="{}">{}</a></li>'.format(e(root + href), e(label))
        for label, href in FOOTER_COMPANY
    )
    legal_links = " · ".join(
        '<a href="{}">{}</a>'.format(e(root + href), e(label))
        for label, href in FOOTER_LEGAL
    )

    # Города — отдельной строкой: это и навигация, и внутренняя перелинковка
    # на гео-страницы.
    city_links = " · ".join(
        '<a href="{}{}/">{}</a>'.format(e(root), e("vilochnye-pogruzchiki-" + c["slug"]), e(c["name"]))
        for c in cities_data.CITIES
    )

    contacts = ["<li>{}</li>".format(max_link())]
    if SITE["phone"]:
        contacts.insert(0, '<li><a href="tel:{}">{}</a></li>'.format(
            e(SITE["phone_href"]), e(SITE["phone"])))
    if SITE["address"]:
        contacts.append("<li>{}, {}</li>".format(e(SITE["postal_code"]), e(SITE["address"])))
    if SITE["email"]:
        contacts.append('<li><a href="mailto:{0}">{0}</a></li>'.format(e(SITE["email"])))

    about = SITE.get("footer_about", "")

    return (
        '<footer>\n'
        '  <div class="wrap">\n'
        '    <div class="foot-grid">\n'
        '      <div class="foot-col foot-about">\n'
        '        {logo}\n'
        '        {about}\n'
        '      </div>\n'
        '      <div class="foot-col">\n'
        '        <h2>Каталог</h2>\n'
        '        <ul>\n          {catalog}\n        </ul>\n'
        '      </div>\n'
        '      <div class="foot-col">\n'
        '        <h2>Компания</h2>\n'
        '        <ul>\n          {company}\n        </ul>\n'
        '      </div>\n'
        '      <div class="foot-col">\n'
        '        <h2>Контакты</h2>\n'
        '        <ul>\n          {contacts}\n        </ul>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="foot-geo">\n'
        '      <h2>Города обслуживания</h2>\n'
        '      <p>{cities}</p>\n'
        '    </div>\n'
        '    <div class="foot-bottom">\n'
        '      <p>© 2026 {name}</p>\n'
        '      <p>{legal}</p>\n'
        '    </div>\n'
        '  </div>\n'
        '</footer>'
    ).format(
        logo=render_logo(root),
        about="<p>{}</p>".format(e(about)) if about else "",
        catalog=catalog_links,
        company=company_links,
        contacts="\n          ".join(contacts),
        cities=city_links,
        name=e(SITE["name"]),
        legal=legal_links,
    )


# --------------------------------------------------------------------------
# Повторяющиеся куски страниц
# --------------------------------------------------------------------------

def render_breadcrumbs(root, trail):
    """trail — список (название, href или None для текущей страницы)."""
    parts = []
    for label, href in trail:
        if href is None:
            parts.append("<span>{}</span>".format(e(label)))
        else:
            parts.append('<a href="{}">{}</a>'.format(e(root + href), e(label)))
    return '<div class="breadcrumbs">{}</div>'.format("<span>/</span>".join(parts))


def render_lead_form(selected_type=None):
    """Блок заявки.

    Пока адрес приёма пуст, форма не притворяется рабочей: сверху стоит блок
    с живыми каналами, и он же несёт основную кнопку. Раньше человек узнавал
    о том, что отправлять некуда, только после того как заполнил пять полей —
    это было последнее, что он видел на сайте.
    """
    options = []
    for t in LEAD_TYPES:
        sel = " selected" if t == selected_type else ""
        options.append("<option{}>{}</option>".format(sel, e(t)))

    live = bool(SITE.get("lead_endpoint")) and bool(SITE.get("lead_access_key"))

    offline = ""
    if not live:
        phone = ""
        if SITE["phone"]:
            phone = '<a class="btn btn-ghost" href="tel:{}">Позвонить {}</a>'.format(
                e(SITE["phone_href"]), e(SITE["phone"]))
        offline = (
            '            <div class="lead-offline">\n'
            '              <p><b>Отправка формы пока не подключена.</b> Заявку принимаем '
            'в мессенджере и по телефону — ответим в тот же день.</p>\n'
            '              <div class="lead-offline__actions">{max}{phone}</div>\n'
            '            </div>\n'
        ).format(max='<a class="btn btn-primary" href="{}" target="_blank" rel="noopener">'
                     'Написать в MAX</a>'.format(e(SITE["max_url"])),
                 phone=phone)

    # Разметку успеха выводим только когда есть куда отправлять: иначе на
    # каждой странице лежит обещание «менеджер свяжется», которое некому
    # выполнить.
    success = ""
    if live:
        success = (
            '            <div class="form-success" id="formSuccess">\n'
            '              <svg class="ico" viewBox="0 0 100 100" fill="none" stroke="currentColor" '
            'stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<circle cx="50" cy="50" r="42"/><path d="M32 52 L44 64 L70 36"/></svg>\n'
            '              <h3>Заявка отправлена</h3>\n'
            '              <p>Ответим в течение рабочего дня.</p>\n'
            '            </div>\n'
        )

    submit = "Отправить заявку" if live else "Отправить заявку почтой"

    return (
        '  <section id="lead" class="calc-sec">\n'
        '    <div class="wrap">\n'
        '      <div class="calc-grid">\n'
        '        <div>\n'
        '          <h2 class="lead-title">Опишите задачу — подберём технику</h2>\n'
        '          <p class="lead-sub">Что и на какую высоту поднимаете, в помещении или на '
        'улице, сколько смен в сутки. Пришлём два-три подходящих варианта с характеристиками.</p>\n'
        '        </div>\n'
        '        <div>\n'
        '{offline}'
        '          <form class="lead" id="leadForm" novalidate>\n'
        '            <div class="form-row">\n'
        '              <div class="field">\n'
        '                <label for="f-type">Тип техники</label>\n'
        '                <select id="f-type" data-field="type">{options}</select>\n'
        '              </div>\n'
        '              <div class="field">\n'
        '                <label for="f-task">Что поднимаете и на какую высоту</label>\n'
        '                <input id="f-task" data-field="brand" type="text" '
        'placeholder="паллеты до 3 м">\n'
        '              </div>\n'
        '            </div>\n'
        '            <div class="form-row">\n'
        '              <div class="field">\n'
        '                <label for="f-name">Ваше имя</label>\n'
        '                <input id="f-name" data-field="name" type="text" '
        'autocomplete="name" required>\n'
        '              </div>\n'
        '              <div class="field">\n'
        '                <label for="f-phone">Телефон</label>\n'
        '                <input id="f-phone" data-field="phone" type="tel" inputmode="tel" '
        'autocomplete="tel" placeholder="+7 900 000-00-00" '
        'pattern="[+0-9 ()\\-]{{10,20}}" required>\n'
        '              </div>\n'
        '            </div>\n'
        '            <div class="field full" style="margin-bottom:16px;">\n'
        '              <label for="f-comment">Условия работы</label>\n'
        '              <textarea id="f-comment" data-field="comment" '
        'placeholder="склад с низким потолком, две смены"></textarea>\n'
        '            </div>\n'
        '            <div class="field full" aria-hidden="true" style="position:absolute; left:-9999px;">\n'
        '              <label for="f-company">Не заполняйте это поле</label>\n'
        '              <input id="f-company" data-field="company" type="text" tabindex="-1" '
        'autocomplete="off">\n'
        '            </div>\n'
        '            <p class="form-msg" id="formMsg" role="alert" hidden></p>\n'
        '            <button type="submit" class="btn {btn}">{submit}</button>\n'
        '            <p class="form-note">Нажимая кнопку, вы соглашаетесь с '
        '<a href="@ROOT@politika-konfidencialnosti/">политикой обработки персональных данных</a></p>\n'
        '{success}'
        '          </form>\n'
        '        </div>\n'
        '      </div>\n'
        '    </div>\n'
        '  </section>'
    ).format(options="".join(options), offline=offline, success=success,
             submit=submit, btn="btn-primary" if live else "btn-ghost")


def render_photo(product, eager=False):
    """Фотография позиции.

    width/height обязательны: без них браузер не знает высоту до загрузки
    и содержимое прыгает (это метрика CLS). srcset отдаёт версию 1600 px
    экранам с двойной плотностью. Первая карточка грузится сразу, остальные
    лениво — они ниже первого экрана.
    """
    if not product.get("photo"):
        return FORKLIFT_SVG.format(w="2.5")
    name = product["photo"]
    return (
        '<img src="@ROOT@assets/img/{name}-800.webp" '
        'srcset="@ROOT@assets/img/{name}-800.webp 800w, '
        '@ROOT@assets/img/{name}-1600.webp 1600w" '
        'sizes="(max-width: 620px) 100vw, (max-width: 1120px) 45vw, 30vw" '
        'width="800" height="{h}" alt="{alt}" loading="{loading}" decoding="async">'
    ).format(name=e(name), h=product.get("photo_height", 600),
             alt=e(product.get("photo_alt", product["name"])),
             loading="eager" if eager else "lazy")


def render_product(product, specs, cat_slug):
    """Карточка позиции в справочнике подбора.

    Здесь нет ни «в наличии», ни цены: наличие подтверждает поставщик под
    конкретный запрос, цену называет тоже он. Ориентир по бюджету лежит
    только в data-price — по нему работает фильтр, на странице он не виден.
    """
    badge = '<span class="product-badge sample">Образец</span>' if product.get("sample") else ""
    eager = product["_order"] == 1

    # Два ключевых параметра — чипами наверху: по ним технику ищут в первую
    # очередь. Остальное — списком ниже, чтобы карточка не превращалась
    # в облако из десятка одинаковых плашек. У навесного оборудования нет
    # высоты подъёма, а «грузоподъёмность» — это его собственная, а не
    # машины, поэтому чип не выводится, если поля нет вовсе.
    chips = []
    if product.get("capacity") is not None:
        chips.append('<span>{} кг</span>'.format(product["capacity"]))
    if product.get("lift_mm"):
        chips.append("<span>{}</span>".format(e(format_lift(product["lift_mm"]))))

    rows = []
    data_attrs = []
    for spec in specs:
        value = product.get(spec["key"])
        if value is None:
            continue
        rows.append(
            "<div><dt>{}</dt><dd>{}</dd></div>".format(
                e(spec["label"]), e(spec_value_label(spec, value)))
        )
        if spec.get("filter"):
            data_attrs.append(' data-spec-{}="{}"'.format(e(spec["key"]), e(str(value))))

    spec_list = '<dl class="product-spec-list">{}</dl>'.format("".join(rows)) if rows else ""
    desc = '<p class="product-desc">{}</p>'.format(e(product["desc"])) if product.get("desc") else ""

    return (
        '            <div class="product-card" data-cat="{cat}" data-capacity="{cap}" data-lift="{lift}" '
        'data-price="{budget}" data-order="{order}"{attrs}>\n'
        '              <div class="product-img">{badge}{img}</div>\n'
        '              <div class="product-body">\n'
        '                <h3>{name}</h3>\n'
        '                {desc}\n'
        '                <div class="product-specs">{chips}</div>\n'
        '                {spec_list}\n'
        '                <div class="product-price">Цена по запросу</div>\n'
        '                <div class="product-actions">\n'
        '                  <button type="button" class="btn btn-primary" data-buy="select">Подобрать</button>\n'
        '                </div>\n'
        '              </div>\n'
        '            </div>'
    ).format(
        cat=e(cat_slug),
        cap=product.get("capacity", 0),
        lift=product.get("lift_mm", 0),
        budget=product["budget"],
        order=product["_order"],
        attrs="".join(data_attrs),
        badge=badge,
        img=render_photo(product, eager),
        name=e(product["name"]),
        desc=desc,
        chips="".join(chips),
        spec_list=spec_list,
    )



# ---- Характеристики позиций -------------------------------------------------
# Единственный источник правды — `specs` категории в data/catalog.py (SPECS
# для техники, ATTACHMENT_SPECS для навесного). Здесь только вывод, поэтому
# все функции ниже принимают список характеристик параметром, а не читают
# общий SPECS напрямую — иначе навесное оборудование получило бы «Мачту»
# и «Кабину», которых у него нет.


def spec_value_label(spec, value):
    """Подпись значения: для enum — из справочника, для числа — само число."""
    if spec["type"] == "num":
        return "{}{}".format(value, spec.get("unit", ""))
    if spec.get("values"):
        for val, label in spec["values"]:
            if val == value:
                return label
        # Значение, которого нет в справочнике, — опечатка в данных, а не
        # повод молча отрисовать сырой код на странице.
        raise AssertionError(
            "неизвестное значение {!r} у характеристики {!r}".format(value, spec["key"]))
    return str(value)


def format_lift(mm):
    """3000 -> «3,0 м». Хранится в мм, чтобы по высоте можно было фильтровать."""
    return "{:.1f} м".format(mm / 1000).replace(".", ",")


def collect_filter_options(products, specs, all_brands):
    """Все значения характеристики, а не только те, что есть у этих позиций.

    Раньше фильтр показывал лишь варианты, под которые в разделе уже есть
    техника — так пропадали, например, «Со свободным ходом» у мачты или
    бренды, которых нет именно в этой категории. Теперь показываем весь
    справочник значений (как тоннажные чипсы: непредставленный вариант не
    прячется, а гасится — кликнуть по нему можно, выдача будет пустой, а
    под ней форма заявки).

    Характеристику, которая для этой категории вообще не заполняется ни у
    одной позиции (например, «Аккумулятор» у дизельных), не показываем —
    это не «вариант без примера», а поле, которого здесь в принципе не
    бывает. Фильтр с одним значением тоже не возвращается: выбирать не
    из чего, а место в сайдбаре он занимает.
    """
    out = []
    for spec in specs:
        if not spec.get("filter"):
            continue
        present = [p.get(spec["key"]) for p in products if p.get(spec["key"]) is not None]
        if not present:
            continue
        if spec.get("values"):
            ordered = list(spec["values"])
        else:
            ordered = [(v, v) for v in all_brands]
        if len(ordered) < 2:
            continue
        counts = {v: present.count(v) for v, _ in ordered}
        out.append((spec, ordered, counts))
    return out


def render_type_tiles(active_slug):
    """Плитки типов техники над каталогом — переход между разделами."""
    tiles = []
    for c in CATEGORIES:
        cls = "type-tile active" if c["slug"] == active_slug else "type-tile"
        img = ""
        if c.get("photo"):
            # 56×44 — реальный размер бокса в CSS (.type-tile img), не размер
            # исходной карточной фотографии. Указывать здесь photo_height
            # (могло быть 1063) значит соврать браузеру про intrinsic aspect
            # ratio и получить не тот резерв места до применения стилей.
            img = (
                '<img src="@ROOT@assets/img/{photo}-800.webp" alt="" width="56" height="44" '
                'loading="lazy" decoding="async">'
            ).format(photo=e(c["photo"]))
        tiles.append(
            '            <a class="{cls}" href="@ROOT@catalog/{slug}/">{img}<span>{name}</span></a>'.format(
                cls=cls, slug=e(c["slug"]), img=img, name=e(c["name"]))
        )
    return (
        '        <nav class="type-tiles" aria-label="Типы погрузчиков">\n'
        '{tiles}\n'
        '        </nav>'
    ).format(tiles="\n".join(tiles))


def render_chip_filters(products, specs, tonnage):
    """Фильтры строками чипсов над сеткой — как в прайсах поставщиков.

    Чипс, под который в разделе нет ни одной позиции, не убирается, а
    гасится: ряд грузоподъёмностей должен читаться как ряд, с дырками он
    выглядит сломанным. Кликнуть по такому можно — выдача будет пустой,
    а под ней форма: для сервиса подбора это заявка, а не тупик.

    `tonnage=False` (навесное оборудование) убирает ряды грузоподъёмности
    машины и высоты подъёма целиком — это не тоннажный товар, и пустой ряд
    с одними погашенными чипсами выглядел бы хуже, чем его отсутствие.
    """
    def chip(group, attr, value, label, count):
        empty = "" if count else " is-empty"
        note = '<span class="chip-count">{}</span>'.format(count) if count else ""
        return (
            '<label class="chip{empty}"><input type="checkbox" data-filter-group="{group}" '
            'data-attr="{attr}" value="{value}">{label}{note}</label>'
        ).format(empty=empty, group=e(group), attr=e(attr), value=e(str(value)),
                 label=e(label), note=note)

    def row(title, chips):
        return (
            '          <div class="chip-row">\n'
            '            <span class="chip-row-label">{title}</span>\n'
            '            <div class="chip-set">{chips}</div>\n'
            '          </div>\n'
        ).format(title=e(title), chips="".join(chips))

    rows = []

    if tonnage:
        caps = [p.get("capacity") for p in products]
        rows.append(row("По грузоподъёмности", [
            chip("capacity", "capacity", value, label, caps.count(value))
            for value, label in TONNAGE_CHIPS
        ]))

        lifts = [p["lift_mm"] for p in products if p.get("lift_mm")]
        lift_chips = []
        for value, label in LIFT_RANGES:
            lo, _, hi = value.partition("-")
            lo_n, hi_n = int(lo or 0), (int(hi) if hi else None)
            count = sum(1 for v in lifts if v >= lo_n and (hi_n is None or v <= hi_n))
            lift_chips.append(chip("range", "lift", value, label, count))
        rows.append(row("По высоте подъёма", lift_chips))

    for spec, options, counts in collect_filter_options(products, specs, BRANDS):
        rows.append(row(spec["label"], [
            chip("spec", spec["key"], value, label, counts[value])
            for value, label in options
        ]))

    return (
        '        <div class="chip-filters" id="catalogFilters">\n'
        '{rows}'
        '          <div class="chip-row chip-row-budget">\n'
        '            <span class="chip-row-label">Бюджет, ₽</span>\n'
        '            <div class="filter-price">\n'
        '              <input type="number" data-filter-group="price-min" placeholder="от" '
        'min="0" aria-label="Бюджет от">\n'
        '              <span>—</span>\n'
        '              <input type="number" data-filter-group="price-max" placeholder="до" '
        'min="0" aria-label="Бюджет до">\n'
        '            </div>\n'
        '            <button type="button" class="filters-reset">Сбросить</button>\n'
        '          </div>\n'
        '        </div>'
    ).format(rows="".join(rows))


def render_catalog_body(products, heading, active_slug, specs, tonnage):
    cards = "\n\n".join(render_product(p, specs, active_slug) for p in products)
    count = len(products)
    return (
      '      <div class="catalog-layout">\n\n'
      '{tiles}\n\n'
      '        <h2 class="catalog-h2">{heading}</h2>\n\n'
      '        <button type="button" class="filters-toggle" aria-expanded="false" '
      'aria-controls="catalogFilters">Фильтры</button>\n\n'
      '{filters}\n\n'
      '        <div class="sort-bar">\n'
      '          <span class="count">Показано {count} из {count}</span>\n'
      '          <div class="sort-field">\n'
      '            <label for="catalogSort">Сортировка</label>\n'
      '            <select id="catalogSort" data-sort>\n'
      '              <option value="default">По умолчанию</option>\n'
      '              <option value="price-asc">Сначала дешевле</option>\n'
      '              <option value="price-desc">Сначала дороже</option>\n'
      '              <option value="capacity">По грузоподъёмности</option>\n'
      '            </select>\n'
      '          </div>\n'
      '        </div>\n\n'
      '        <div class="product-grid">\n\n{cards}\n\n        </div>\n\n'
      '        <div class="catalog-pagination">\n'
      '          <span class="count">Показано {count} из {count}</span>\n'
      '          <a href="#lead" class="btn btn-ghost btn-sm">Не нашли подходящее — опишите задачу →</a>\n'
      '        </div>\n'
      '      </div>'
    ).format(tiles=render_type_tiles(active_slug), filters=render_chip_filters(products, specs, tonnage),
             cards=cards, count=count, heading=e(heading))


def render_blocks(blocks, root):
    """Блоки текстовых страниц. Пустой блок не выводится."""
    out = []
    for block in blocks:
        kind = block["type"]

        if kind == "h2" and block.get("text"):
            out.append("<h2>{}</h2>".format(e(block["text"])))

        elif kind == "p" and block.get("text"):
            out.append("<p>{}</p>".format(e(block["text"])))

        elif kind in ("ul", "ol") and block.get("items"):
            items = "".join("<li>{}</li>".format(e(i)) for i in block["items"])
            out.append("<{0}>{1}</{0}>".format(kind, items))

        elif kind == "faq" and block.get("items"):
            faq = []
            for i, (q, a) in enumerate(block["items"]):
                open_cls = " open" if i == 0 else ""
                faq.append(
                    '<div class="faq-item{cls}"><button class="faq-q"><span>{q}</span>'
                    '<span class="plus">+</span></button>'
                    '<div class="faq-a"><p>{a}</p></div></div>'.format(cls=open_cls, q=e(q), a=e(a))
                )
            out.append('<div class="faq-list">{}</div>'.format("".join(faq)))

        elif kind == "links" and block.get("items"):
            # Внешние источники: новая вкладка и rel="noopener" — без него
            # открытая страница получает доступ к window.opener.
            items = "".join(
                '<li><a href="{url}" target="_blank" rel="noopener">{text}</a></li>'.format(
                    url=e(url), text=e(text))
                for text, url in block["items"]
            )
            out.append('<ul class="source-list">{}</ul>'.format(items))

        elif kind == "contacts":
            out.append(render_contacts())

        elif kind == "map":
            if SITE["geo_lat"] and SITE["geo_lon"]:
                # Ссылка на Яндекс.Карты, а не встроенный iframe: карта тянет
                # сторонние скрипты и тормозит страницу, а нужна она единицам.
                out.append(
                    '<p class="map-link"><a href="https://yandex.ru/maps/?pt={lon},{lat}&z=17&l=map" '
                    'target="_blank" rel="noopener">Открыть {addr} на Яндекс.Картах</a></p>'.format(
                        lat=e(SITE["geo_lat"]), lon=e(SITE["geo_lon"]),
                        addr=e(SITE["address"]))
                )

        elif kind == "reviews" and block.get("items"):
            cards = "".join(
                '<div class="test-card"><span class="quote-mark">"</span><p>{text}</p>'
                '<div class="who"><div class="avatar">{initial}</div><div><b>{who}</b>'
                '<span>{role}</span></div></div></div>'.format(
                    text=e(r["text"]), initial=e(r["who"][:1]), who=e(r["who"]), role=e(r.get("role", ""))
                )
                for r in block["items"]
            )
            out.append('<div class="test-grid">{}</div>'.format(cards))

    return "\n      ".join(out)


def render_contacts():
    """Реквизиты. Выводим только заполненные поля."""
    rows = []
    status = ("Самозанятый, плательщик налога на профессиональный доход"
              if SITE.get("self_employed") else "")
    fields = [
        ("Исполнитель", SITE["legal_name"]),
        ("Статус", status if SITE["legal_name"] else ""),
        ("ИНН", SITE["inn"]),
        ("Адрес", "{}, {}, {}".format(SITE["postal_code"], SITE["address_locality"], SITE["address"]) if SITE["address"] else ""),
        ("Телефон", SITE["phone"]),
        ("E-mail", SITE["email"]),
        ("Режим работы", SITE["opening_hours"]),
    ]
    for label, value in fields:
        if value:
            rows.append("<tr><th>{}</th><td>{}</td></tr>".format(e(label), e(value)))

    table = ""
    if rows:
        table = '<div class="table-wrap"><table class="req-table">{}</table></div>'.format("".join(rows))

    channel = '<p class="contact-channel">Связаться с нами: {}</p>'.format(max_link("contact-max"))

    if not rows:
        # Пока реквизитов нет — честная строка вместо пустой таблицы.
        notice = ('<p class="notice">Реквизиты будут опубликованы здесь после '
                  'регистрации. Сейчас связаться можно через мессенджер.</p>')
        return notice + channel

    return table + channel


# --------------------------------------------------------------------------
# Разметка schema.org
# --------------------------------------------------------------------------

def build_jsonld(page, canonical, trail):
    """Граф разметки: Organization + WebSite на всех страницах, плюс тип
    самой страницы, хлебные крошки и FAQ, если они есть."""
    domain = SITE["domain"]

    # ProfessionalService, а не Organization с товарами: мы оказываем услугу
    # подбора, техникой не торгуем. areaServed заменяет адрес — площадки нет.
    organization = {
        "@type": "ProfessionalService",
        "@id": domain + "/#organization",
        "name": SITE["name"],
        "url": domain + "/",
        "serviceType": "Подбор вилочных погрузчиков",
        "areaServed": {"@type": "AdministrativeArea", "name": SITE["region"]},
    }
    if SITE["legal_name"]:
        organization["founder"] = {"@type": "Person", "name": SITE["legal_name"]}
    if SITE.get("opening_hours_schema"):
        organization["openingHours"] = SITE["opening_hours_schema"]
    if SITE["geo_lat"] and SITE["geo_lon"]:
        organization["geo"] = {
            "@type": "GeoCoordinates",
            "latitude": SITE["geo_lat"],
            "longitude": SITE["geo_lon"],
        }
    if SITE["phone"]:
        organization["telephone"] = SITE["phone"]
    if SITE["email"]:
        organization["email"] = SITE["email"]
    if SITE["address"]:
        organization["address"] = {
            "@type": "PostalAddress",
            "streetAddress": SITE["address"],
            "addressLocality": SITE["address_locality"],
            "postalCode": SITE["postal_code"],
            "addressRegion": SITE["region"],
            "addressCountry": "RU",
        }

    website = {
        "@type": "WebSite",
        "@id": domain + "/#website",
        "url": domain + "/",
        "name": SITE["name"],
        "publisher": {"@id": domain + "/#organization"},
        "inLanguage": "ru-RU",
    }

    page_node = {
        "@type": page.get("schema_type", "WebPage"),
        "@id": canonical,
        "url": canonical,
        "name": page["title"],
        "description": page["description"],
        "isPartOf": {"@id": domain + "/#website"},
        "inLanguage": "ru-RU",
    }

    graph = [page_node, website, organization]

    # Article: заголовок статьи (может отличаться от <title>), даты и автор.
    # Автор — отдельный узел Person, на который page_node ссылается по @id,
    # а не встроенный объект: так его можно переиспользовать между статьями,
    # если у них общий автор, без дублирования полей.
    art = page.get("article")
    if art:
        author_id = domain + "/#author"
        page_node.update({
            "headline": art["headline"],
            "datePublished": art["published"],
            "dateModified": art["updated"],
            "author": {"@id": author_id},
            "publisher": {"@id": domain + "/#organization"},
        })
        graph.append({
            "@type": "Person",
            "@id": author_id,
            "name": art["author_name"],
            "url": domain + "/o-servise/",
            "jobTitle": "Подбор вилочных погрузчиков",
        })

    # Service — на страницах, описывающих саму услугу. Отдельный узел, а не
    # свойство организации: так поисковик связывает услугу с областью работы.
    if page.get("service"):
        graph.append({
            "@type": "Service",
            "@id": canonical + "#service",
            "name": page["service"],
            "serviceType": "Подбор вилочных погрузчиков",
            "provider": {"@id": domain + "/#organization"},
            "areaServed": {"@type": "AdministrativeArea", "name": SITE["region"]},
            "isRelatedTo": {"@id": domain + "/#website"},
        })

    if len(trail) > 1:
        items = []
        for i, (label, href) in enumerate(trail, start=1):
            node = {"@type": "ListItem", "position": i, "name": label}
            if href is not None:
                node["item"] = domain + "/" + href.replace("index.html", "")
            items.append(node)
        breadcrumb_id = canonical + "#breadcrumb"
        page_node["breadcrumb"] = {"@id": breadcrumb_id}
        graph.append({
            "@type": "BreadcrumbList",
            "@id": breadcrumb_id,
            "itemListElement": items,
        })

    faq_items = []
    for block in page.get("blocks", []):
        if block["type"] == "faq":
            faq_items.extend(block.get("items", []))
    faq_items.extend(page.get("faq", []))
    if faq_items:
        graph.append({
            "@type": "FAQPage",
            "@id": canonical + "#faq",
            "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faq_items
            ],
        })

    data = {"@context": "https://schema.org", "@graph": graph}
    return '<script type="application/ld+json">{}</script>'.format(
        json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    )


# --------------------------------------------------------------------------
# Рендер страницы целиком
# --------------------------------------------------------------------------

BASE = (TPL / "base.html").read_text(encoding="utf-8")


def render_page(page):
    slug = page["slug"]
    root = root_prefix(slug)
    canonical = SITE["domain"] + "/" + (slug + "/" if slug else "")

    trail = page.get("trail", [])
    body = page["body"].replace("@ROOT@", root)

    verification = ""
    if SITE["yandex_verification"]:
        verification += '<meta name="yandex-verification" content="{}">\n'.format(e(SITE["yandex_verification"]))
    if SITE["google_verification"]:
        verification += '<meta name="google-site-verification" content="{}">\n'.format(e(SITE["google_verification"]))

    robots = ""
    if page.get("noindex"):
        robots = '<meta name="robots" content="noindex, follow">\n'

    metrika = ""
    if SITE["metrika_id"]:
        metrika = (
            '<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};'
            'm[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,'
            'a.parentNode.insertBefore(k,a)})(window,document,"script",'
            '"https://mc.yandex.ru/metrika/tag.js","ym");'
            'ym({id},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script>\n'
            '<noscript><div><img src="https://mc.yandex.ru/watch/{id}" style="position:absolute;left:-9999px" '
            'alt=""></div></noscript>'
        ).replace("{id}", str(SITE["metrika_id"]))

    out = BASE
    for key, value in {
        "title": e(page["title"]),
        "description": e(page["description"]),
        "canonical": e(canonical),
        "og_type": page.get("og_type", "website"),
        "site_name": e(SITE["name"]),
        "domain": e(SITE["domain"]),
        "lead_endpoint": e(SITE.get("lead_endpoint", "")) if SITE.get("lead_access_key") else "",
        "lead_access_key": e(SITE.get("lead_access_key", "")),
        "robots": robots,
        "verification": verification,
        "jsonld": build_jsonld(page, canonical, trail),
        "metrika": metrika,
        "root": root,
        "ver": VER,
        "header": render_header(root, slug, "id=\"lead\"" in body),
        "footer": render_footer(root),
        "body": body,
    }.items():
        out = out.replace("{{" + key + "}}", value)

    dest = ROOT / (slug + "/index.html" if slug else "index.html")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    return dest


# --------------------------------------------------------------------------
# Страницы
# --------------------------------------------------------------------------

def page_home():
    """Главная. Каталог остаётся структурой страницы, но над ним стоит то,
    ради чего человек вообще пишет нам, а не дилеру: сравнение вариантов,
    бесплатность и договор напрямую. Раньше этих доводов на странице решения
    не было ни одного — они лежали только на «Как это работает».

    Полосы иконок категорий здесь больше нет: она вела в те же три места,
    что и карточки под ней, и съедала первый экран одинаковым SVG трижды.
    """
    cards = []
    for c in CATEGORIES:
        cards.append(
            '        <a class="listing-card" href="@ROOT@catalog/{slug}/">\n'
            '          <div class="listing-img">{img}</div>\n'
            '          <div class="listing-body">\n'
            '            <h3>{name}</h3>\n'
            '            <p class="listing-note">{note}</p>\n'
            '            <div class="listing-foot">\n'
            '              <span class="btn btn-ghost btn-sm">Смотреть →</span>\n'
            '            </div>\n'
            '          </div>\n'
            '        </a>'.format(
                slug=e(c["slug"]), img=render_photo(c, eager=True),
                name=e(c["name"]), note=e(c.get("card_note", "")),
            )
        )

    city_links = "".join(
        '<li><a href="@ROOT@vilochnye-pogruzchiki-{slug}/">Вилочные погрузчики в {name_in}</a></li>'.format(
            slug=e(c["slug"]), name_in=e(c["name_in"])
        )
        for c in cities_data.CITIES
    )

    # Доводы взяты с «Как это работает»: там они уже выверены юридически.
    offer = [
        ("Подбор бесплатен",
         "Вознаграждение платит поставщик. С покупателя мы не берём ничего, "
         "и цена техники от нашего участия не растёт."),
        ("Сравниваем нескольких поставщиков",
         "Дилер предложит только то, что продаёт сам. Мы приносим два-три "
         "варианта у разных и объясняем разницу."),
        ("Договор напрямую с поставщиком",
         "Деньги через нас не идут. Мы не сторона сделки — наша работа "
         "заканчивается, когда вы выбрали."),
    ]
    offer_html = "".join(
        '<div class="offer-item"><b class="offer-title">{t}</b><p>{d}</p></div>'.format(t=e(t), d=e(d))
        for t, d in offer
    )

    steps = [
        ("Заявка", "Опишите задачу: что поднимаете, на какую высоту, в помещении или на улице."),
        ("Подбор", "Присылаем два-три подходящих варианта с характеристиками и ориентиром по бюджету."),
        ("Поставщик", "Сводим с тем, у кого выбранная техника есть в наличии."),
        ("Сделка", "Дальше вы работаете с поставщиком напрямую."),
    ]
    steps_html = "".join(
        '<div class="proc-item"><div class="idx">{i:02d}</div>'
        '<div><h3>{t}</h3></div><p>{d}</p></div>'.format(i=i, t=e(t), d=e(d))
        for i, (t, d) in enumerate(steps, start=1)
    )

    # Блок статей пропускается целиком, если писать пока нечего — заголовок
    # без карточек под ним хуже, чем отсутствие раздела (см. правило вверху
    # файла: сборка не выводит пустые блоки).
    articles_section = ""
    if ARTICLES:
        articles_section = (
            '  <section id="articles" style="padding-top:0;">\n'
            '    <div class="wrap">\n'
            '      <div class="section-head"><div><h2>Полезные статьи</h2></div>\n'
            '        <p><a href="@ROOT@articles/index.html" class="inline-link">Все статьи →</a></p></div>\n'
            '      <div class="articles-grid">\n{grid}      </div>\n'
            '    </div>\n'
            '  </section>\n\n'
        ).format(grid=render_article_cards())

    body = (
        '  <section id="catalog" style="padding-top:48px;">\n'
        '    <div class="wrap">\n'
        '      <h1 class="page-h1">Подбор вилочных погрузчиков в {region_in}</h1>\n'
        '      <p class="page-intro">Электрические, дизельные и газобаллонные. Опишите задачу — '
        'что поднимаете, на какую высоту и в каких условиях работает техника — и получите '
        'подборку подходящих моделей с характеристиками.</p>\n\n'
        '      <div class="offer">{offer}</div>\n\n'
        '      <h2 class="catalog-h2">Типы вилочных погрузчиков</h2>\n'
        '      <div class="listing-grid">\n{cards}\n      </div>\n'
        '    </div>\n'
        '  </section>\n\n'
        '  <section id="process" style="padding-top:0;">\n'
        '    <div class="wrap">\n'
        '      <div class="section-head"><div><h2>Четыре шага до техники</h2></div>\n'
        '        <p>Подробнее — на странице <a href="@ROOT@kak-rabotaem/" class="inline-link">'
        'как это работает</a>.</p></div>\n'
        '      <div class="process-list">{steps}</div>\n'
        '    </div>\n'
        '  </section>\n\n'
        '{articles}'
        '  <section id="geo" style="padding-top:0;">\n'
        '    <div class="wrap">\n'
        '      <div class="section-head"><div><h2>Где мы работаем</h2></div></div>\n'
        '      <ul class="geo-list">{cities}</ul>\n'
        '    </div>\n'
        '  </section>\n\n'
        '{form}'
    ).format(
        region_in=e(SITE["region_in"]),
        offer=offer_html,
        cards="\n".join(cards),
        steps=steps_html,
        articles=articles_section,
        cities=city_links,
        form=render_lead_form(),
    )

    return {
        "slug": "",
        "title": "Подбор вилочных погрузчиков в Екатеринбурге и области",
        "description": "Подбор вилочного погрузчика под задачу склада: электрические, дизельные и газобаллонные модели. Сравним характеристики и грузоподъёмность, поможем выбрать.",
        "schema_type": "WebPage",
        "service": "Подбор вилочных погрузчиков",
        "trail": [("Главная", None)],
        "body": body,
    }


def page_category(category):
    products = []
    for i, p in enumerate(category["products"], start=1):
        p = dict(p)
        p["_order"] = i
        products.append(p)

    intro = '<p class="page-intro">{}</p>'.format(e(category["intro"])) if category["intro"] else ""

    body = (
        '  <section style="padding-top:40px; padding-bottom:0;">\n'
        '    <div class="wrap">\n'
        '      {crumbs}\n'
        '      <h1 class="page-h1">{h1}</h1>\n'
        '      {intro}\n'
        '    </div>\n'
        '  </section>\n\n'
        '  <section style="padding-top:32px;">\n'
        '    <div class="wrap">\n'
        '{catalog}\n'
        '    </div>\n'
        '  </section>\n\n'
        '{form}'
    ).format(
        crumbs=render_breadcrumbs("@ROOT@", [
            ("Главная", "index.html"),
            ("Каталог", "index.html#catalog"),
            (category["name"], None),
        ]),
        h1=e(category["h1"]),
        intro=intro,
        catalog=render_catalog_body(products, "{}: модели и характеристики".format(category["name"]),
                                    category["slug"], category["specs"], category["tonnage"]),
        form=render_lead_form(),
    )

    return {
        "slug": "catalog/" + category["slug"],
        "title": category["title"],
        "description": category["description"],
        "schema_type": "CollectionPage",
        "service": "Подбор: {}".format(category["name"].lower()),
        "trail": [("Главная", "index.html"), ("Каталог", "index.html#catalog"), (category["name"], None)],
        "body": body,
    }


def page_text(spec):
    content = render_blocks(spec["blocks"], "@ROOT@")
    has_form = any(b["type"] == "form" for b in spec["blocks"])

    body = (
        '  <section style="padding-top:40px;{pb}">\n'
        '    <div class="wrap">\n'
        '      {crumbs}\n'
        '      <h1 class="page-h1">{h1}</h1>\n'
        '      <article class="article-body">\n'
        '      {content}\n'
        '      </article>\n'
        '    </div>\n'
        '  </section>\n'
        '{form}'
    ).format(
        pb=" padding-bottom:64px;" if has_form else "",
        crumbs=render_breadcrumbs("@ROOT@", [("Главная", "index.html"), (spec["breadcrumb"], None)]),
        h1=e(spec["h1"]),
        content=content,
        form="\n" + render_lead_form() if has_form else "",
    )

    return {
        "slug": spec["slug"],
        "title": spec["title"],
        "description": spec["description"],
        "schema_type": "WebPage",
        "noindex": spec.get("noindex", False),
        "trail": [("Главная", "index.html"), (spec["breadcrumb"], None)],
        "blocks": spec["blocks"],
        "body": body,
    }


def page_city(city):
    spec = cities_data.page(city)

    cat_links = "".join(
        '<li><a href="@ROOT@catalog/{slug}/">{name} с доставкой в {city_in}</a></li>'.format(
            slug=e(c["slug"]), name=e(c["name"]), city_in=e(spec["city_in"])
        )
        for c in CATEGORIES
    )

    unique = '<p>{}</p>'.format(e(spec["unique"])) if spec["unique"] else ""

    faq_html = ""
    if spec["faq"]:
        items = "".join(
            '<div class="faq-item{cls}"><button class="faq-q"><span>{q}</span>'
            '<span class="plus">+</span></button><div class="faq-a"><p>{a}</p></div></div>'.format(
                cls=" open" if i == 0 else "", q=e(q), a=e(a))
            for i, (q, a) in enumerate(spec["faq"])
        )
        faq_html = ('      <h2 id="faq">Частые вопросы</h2>\n'
                    '      <div class="faq-list">{}</div>\n'.format(items))

    body = (
        '  <section style="padding-top:40px; padding-bottom:0;">\n'
        '    <div class="wrap">\n'
        '      {crumbs}\n'
        '      <h1 class="page-h1">{h1}</h1>\n'
        '      <article class="article-body">\n'
        '      {unique}\n'
        '      <h2>Каталог</h2>\n'
        '      <ul class="geo-list">{cats}</ul>\n'
        '{faq}'
        '      </article>\n'
        '    </div>\n'
        '  </section>\n\n'
        '{form}'
    ).format(
        crumbs=render_breadcrumbs("@ROOT@", [
            ("Главная", "index.html"),
            ("Города обслуживания", "index.html#geo"),
            (spec["breadcrumb"], None),
        ]),
        h1=e(spec["h1"]),
        unique=unique,
        cats=cat_links,
        faq=faq_html,
        form=render_lead_form(),
    )

    return {
        "slug": spec["slug"],
        "title": spec["title"],
        "description": spec["description"],
        "schema_type": "WebPage",
        "service": "Подбор вилочных погрузчиков в {}".format(spec["city_in"]),
        # Без своего текста страница — дубль соседней. Собираем, но закрываем
        # от индексации, пока `unique` не заполнен.
        "noindex": not spec["unique"],
        "faq": spec["faq"],
        "trail": [
            ("Главная", "index.html"),
            ("Города обслуживания", "index.html#geo"),
            (spec["breadcrumb"], None),
        ],
        "body": body,
    }


RU_MONTHS = ["", "января", "февраля", "марта", "апреля", "мая", "июня",
             "июля", "августа", "сентября", "октября", "ноября", "декабря"]


def format_date_ru(iso_date):
    """"2026-09-03" -> "3 сентября 2026"."""
    y, m, d = iso_date.split("-")
    return "{} {} {}".format(int(d), RU_MONTHS[int(m)], y)


LIVE_ARTICLE_SLUGS = {a["slug"] for a in ARTICLES}


def render_article_faq(faq):
    if not faq:
        return ""
    items = []
    for i, (q, a) in enumerate(faq):
        open_cls = " open" if i == 0 else ""
        items.append(
            '<div class="faq-item{cls}"><button class="faq-q"><span>{q}</span>'
            '<span class="plus">+</span></button>'
            '<div class="faq-a"><p>{a}</p></div></div>'.format(cls=open_cls, q=e(q), a=e(a))
        )
    return (
        '      <h2 id="faq">Частые вопросы</h2>\n'
        '      <div class="faq-list">{}</div>'
    ).format("".join(items))


def render_article_sources(sources):
    if not sources:
        return ""
    items = "".join(
        '<li><a href="{url}" target="_blank" rel="noopener">{label}</a></li>'.format(
            url=e(url), label=e(label))
        for label, url in sources
    )
    return (
        '      <h2>Источники и нормативка</h2>\n'
        '      <ul class="source-list">{}</ul>'
    ).format(items)


def page_article(article):
    body_html = md_to_html(article["body_md"], LIVE_ARTICLE_SLUGS, root="@ROOT@")
    faq_html = render_article_faq(article["faq"])
    sources_html = render_article_sources(article["sources"])

    body = (
        '  <section class="article-page">\n'
        '    <div class="wrap">\n'
        '      {crumbs}\n'
        '      <div class="article-header">\n'
        '        <h1>{h1}</h1>\n'
        '        <div class="meta"><span>{author}</span><span>Опубликовано {published}</span></div>\n'
        '      </div>\n'
        '      <article class="article-body">\n'
        '{body_html}\n'
        '{faq}\n'
        '{sources}\n'
        '      </article>\n'
        '      <div class="article-cta">\n'
        '        <p>Опишите задачу — подберём модель под неё.</p>\n'
        '        {contact}\n'
        '      </div>\n'
        '      <div class="article-nav"><a href="@ROOT@articles/index.html">← Все статьи</a></div>\n'
        '    </div>\n'
        '  </section>\n'
        '{form}'
    ).format(
        crumbs=render_breadcrumbs("@ROOT@", [
            ("Главная", "index.html"), ("Статьи", "articles/index.html"), (article["h1"], None),
        ]),
        h1=e(article["h1"]),
        author=e(article["author_name"]),
        published=format_date_ru(article["published"]),
        body_html=body_html,
        faq=faq_html,
        sources=sources_html,
        contact=max_link(),
        form=render_lead_form(),
    )

    return {
        "slug": "articles/" + article["slug"],
        "title": article["title"],
        "description": article["description"],
        "schema_type": "Article",
        "trail": [("Главная", "index.html"), ("Статьи", "articles/index.html"), (article["h1"], None)],
        "article": {
            "headline": article["h1"],
            "published": article["published"],
            "updated": article["updated"],
            "author_name": article["author_name"],
        },
        "faq": article["faq"],
        "body": body,
    }


def render_article_cards():
    if not ARTICLES:
        return ""
    ordered = sorted(ARTICLES, key=lambda a: a["order"])
    cards = []
    for a in ordered:
        cards.append((
            '        <a class="article-card" href="@ROOT@articles/{slug}/">\n'
            '          <div class="thumb"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" '
            'stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<rect x="16" y="62" width="52" height="10" rx="5"/><circle cx="28" cy="78" r="8"/>'
            '<circle cx="56" cy="78" r="8"/><path d="M24 62 L24 46 L52 46 L62 34 L76 34 L76 54 L62 62 Z"/>'
            '<rect x="30" y="38" width="16" height="12"/></svg></div>\n'
            '          <div class="body">\n'
            '            <span class="date">{date}</span>\n'
            '            <h2>{h1}</h2>\n'
            '            <p>{desc}</p>\n'
            '            <span class="readmore">Читать →</span>\n'
            '          </div>\n'
            '        </a>\n'
        ).format(slug=e(a["slug"]), date=format_date_ru(a["published"]),
                 h1=e(a["h1"]), desc=e(a["og_description"])))
    return "".join(cards)


def page_articles():
    grid = render_article_cards()
    intro = ("Разборы по выбору и эксплуатации техники." if ARTICLES
             else "Разборы по выбору и эксплуатации техники. Раздел наполняется.")
    body = (
        '  <section style="padding-top:40px;">\n'
        '    <div class="wrap">\n'
        '      {crumbs}\n'
        '      <h1 class="page-h1">Статьи о вилочных погрузчиках</h1>\n'
        '      <p class="page-intro">{intro}</p>\n'
        '      <div class="articles-grid">\n{grid}      </div>\n'
        '    </div>\n'
        '  </section>'
    ).format(
        crumbs=render_breadcrumbs("@ROOT@", [("Главная", "index.html"), ("Статьи", None)]),
        intro=intro, grid=grid,
    )

    return {
        "slug": "articles",
        "title": "Статьи о вилочных погрузчиках — выбор и эксплуатация",
        "description": "Материалы о выборе и эксплуатации вилочных погрузчиков: типы двигателей, грузоподъёмность, высота подъёма, обслуживание и типичные ошибки покупателей.",
        "schema_type": "CollectionPage",
        "trail": [("Главная", "index.html"), ("Статьи", None)],
        "body": body,
    }


# --------------------------------------------------------------------------
# Точка входа
# --------------------------------------------------------------------------

def main():
    force_all = "--all" in sys.argv

    pages = [page_home()]
    pages += [page_category(c) for c in CATEGORIES]
    pages += [page_text(p) for p in TRUST_PAGES]
    pages += [page_text(p) for p in LEGAL_PAGES]
    pages += [page_city(c) for c in cities_data.CITIES]
    pages += [page_article(a) for a in ARTICLES]
    pages.append(page_articles())

    if force_all:
        for p in pages:
            p["noindex"] = False

    written = [render_page(p) for p in pages]

    # sitemap — только индексируемые страницы
    urls = []
    for p in pages:
        if p.get("noindex"):
            continue
        slug = p["slug"]
        urls.append("  <url><loc>{}/{}</loc><changefreq>weekly</changefreq></url>".format(
            SITE["domain"], slug + "/" if slug else ""))
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n",
        encoding="utf-8",
    )

    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\nSitemap: {}/sitemap.xml\n".format(SITE["domain"]),
        encoding="utf-8",
    )

    print("Собрано страниц: {}".format(len(written)))
    print("В sitemap: {}".format(len(urls)))

    # Мы оказываем услугу подбора, а не торгуем. Формулировки продавца на
    # сайте — это и введение покупателя в заблуждение, и готовое основание
    # считать деятельность торговой. Ловим их на выходе, а не на проде.
    slips = []
    for path in written:
        text = path.read_text(encoding="utf-8").lower()
        for phrase in FORBIDDEN_WORDING:
            if phrase.lower() in text:
                slips.append((path.relative_to(ROOT), phrase))
    if slips:
        print("\nФОРМУЛИРОВКИ ПРОДАВЦА — так писать нельзя:")
        for rel, phrase in slips:
            print("  • {}: «{}»".format(rel, phrase))
        return 1

    hidden = [p["slug"] for p in pages if p.get("noindex")]
    if hidden:
        print("\nЗакрыты от индексации (нет своего текста): {}".format(len(hidden)))
        for slug in hidden:
            print("  •", slug)
        print("Заполните `unique` и `faq` в _build/data/cities.py — noindex снимется сам.")

    missing = []
    if not SITE["metrika_id"]:
        missing.append("счётчик Яндекс.Метрики")
    if not SITE["yandex_verification"]:
        missing.append("код подтверждения Яндекс.Вебмастера")
    if missing:
        print("\nНе хватает для полноценного запуска:")
        for m in missing:
            print("  •", m)

    return 0


if __name__ == "__main__":
    sys.exit(main())
