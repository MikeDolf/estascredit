#!/usr/bin/env python3
"""Статические проверки собранных страниц (раздел 10 мастер-промпта).

Запуск:  python3 _checks/check_site.py
Выход:   0 — всё чисто, 1 — есть нарушения.

Скрипт намеренно на стандартной библиотеке: он должен запускаться
где угодно без установки зависимостей.
"""

import json
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urljoin

ROOT = Path(__file__).resolve().parent.parent

# Анкоры, которые по своей природе ведут на разные страницы и не несут
# тематического сигнала. Всё остальное должно вести строго на один URL.
GENERIC_ANCHORS = {
    "читать →", "узнать", "все статьи", "← все статьи", "подробнее",
    "оставить заявку", "оставить заявку →", "получить расчёт",
    "vk", "tg", "wa",
}

# Фразы, которые противоречат фактическим условиям работы.
# Заполняется по анкете: телефон/мессенджеры, минимальный заказ и т.п.
FORBIDDEN_PHRASES: list[tuple[str, str]] = [
    # ("по телефону", "телефон на сайте не публикуется"),
]

# Заглушки, которые нельзя выпускать в публикацию.
PLACEHOLDER_PATTERNS = [
    (r"000-00-00", "телефон-заглушка"),
    (r"<!--\s*TODO", "незакрытый TODO"),
    (r"\bлорем|\blorem", "рыба в тексте"),
    (r"example\.(com|ru)", "домен-заглушка"),
]

# Числовые утверждения вида «X на Y даёт Z». Заполняется по фактуре;
# каждая запись — (regex, функция проверки).
ARITHMETIC_RULES: list[tuple[str, object]] = []

# Блочные элементы разрывают поток текста: без этого «конец одного блока +
# начало следующего» читается как повтор слова прямо в предложении.
BLOCK_TAGS = {
    "address", "article", "aside", "blockquote", "br", "div", "dd", "dl", "dt",
    "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li",
    "main", "nav", "ol", "p", "section", "table", "td", "th", "tr", "ul",
}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.description = ""
        self.links: list[tuple[str, str]] = []   # (href, anchor)
        self.imgs_no_alt = 0
        self.jsonld: list[str] = []
        self.ids: list[str] = []
        self.h1 = 0
        self._in_title = False
        self._in_a = False
        self._in_ld = False
        self._buf: list[str] = []
        self._ld_buf: list[str] = []
        self._href = ""
        self.text_parts: list[str] = []
        self._skip_text = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in BLOCK_TAGS:
            self.text_parts.append("\n")
        if a.get("id"):
            self.ids.append(a["id"])
        if tag == "title":
            self._in_title = True
        elif tag == "h1":
            self.h1 += 1
        elif tag == "meta" and a.get("name") == "description":
            self.description = a.get("content", "")
        elif tag == "img" and not a.get("alt"):
            self.imgs_no_alt += 1
        elif tag == "script":
            if a.get("type") == "application/ld+json":
                self._in_ld = True
                self._ld_buf = []
            else:
                self._skip_text += 1
        elif tag == "style":
            self._skip_text += 1
        elif tag == "a":
            self._in_a = True
            self._href = a.get("href", "")
            self._buf = []

    def handle_endtag(self, tag):
        if tag in BLOCK_TAGS:
            self.text_parts.append("\n")
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            if self._in_ld:
                self.jsonld.append("".join(self._ld_buf))
                self._in_ld = False
            elif self._skip_text:
                self._skip_text -= 1
        elif tag == "style" and self._skip_text:
            self._skip_text -= 1
        elif tag == "a" and self._in_a:
            self.links.append((self._href, " ".join("".join(self._buf).split())))
            self._in_a = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_ld:
            self._ld_buf.append(data)
        if self._in_a:
            self._buf.append(data)
        if not self._skip_text and not self._in_ld:
            self.text_parts.append(data)

    @property
    def text(self) -> str:
        """Видимый текст; переводы строк отмечают границы блоков."""
        joined = "".join(self.text_parts)
        lines = (" ".join(line.split()) for line in joined.split("\n"))
        return "\n".join(line for line in lines if line)


def main() -> int:
    files = sorted(
        p for p in ROOT.rglob("*.html")
        if "_checks" not in p.parts and "node_modules" not in p.parts
    )
    if not files:
        print("Не найдено ни одной HTML-страницы")
        return 1

    pages: dict[Path, Page] = {}
    raw: dict[Path, str] = {}
    for f in files:
        src = f.read_text(encoding="utf-8")
        raw[f] = src
        p = Page()
        p.feed(src)
        pages[f] = p

    problems: list[str] = []
    titles, descriptions = defaultdict(list), defaultdict(list)
    anchor_targets: dict[str, set[str]] = defaultdict(set)

    for f, page in pages.items():
        rel = f.relative_to(ROOT)

        if page.h1 != 1:
            problems.append(f"{rel}: <h1> на странице {page.h1}, должен быть ровно 1")
        if page.imgs_no_alt:
            problems.append(f"{rel}: <img> без alt — {page.imgs_no_alt}")
        titles[page.title.strip()].append(str(rel))
        descriptions[page.description.strip()].append(str(rel))

        # --- JSON-LD ---
        for i, block in enumerate(page.jsonld, 1):
            try:
                json.loads(block)
            except json.JSONDecodeError as e:
                problems.append(f"{rel}: JSON-LD #{i} невалиден — {e}")

        # --- ссылки ---
        for href, anchor in page.links:
            if not href or href.startswith(("mailto:", "tel:", "http://", "https://")):
                continue
            target, frag = urldefrag(urljoin("/" + str(rel), href))
            if href.startswith("#"):
                if frag and frag not in page.ids:
                    problems.append(f"{rel}: якорь #{frag} не существует на странице")
                continue
            dest = ROOT / target.lstrip("/")
            if not dest.exists():
                problems.append(f"{rel}: битая ссылка {href} → {target}")
            elif frag:
                dest_page = pages.get(dest)
                if dest_page and frag not in dest_page.ids:
                    problems.append(f"{rel}: ссылка {href} — якоря #{frag} нет на целевой странице")
            key = anchor.strip().lower()
            if key and key not in GENERIC_ANCHORS:
                anchor_targets[key].add(target)

        # --- заглушки, запретные фразы, опечатки ---
        # placeholder="+7 900 000-00-00" — это подсказка формата ввода,
        # а не телефон компании: вырезаем такие атрибуты перед проверкой.
        scan = re.sub(r'placeholder="[^"]*"', "", raw[f])
        for pattern, label in PLACEHOLDER_PATTERNS:
            if re.search(pattern, scan, re.I):
                problems.append(f"{rel}: заглушка в публикации — {label}")
        low = page.text.lower()
        for phrase, why in FORBIDDEN_PHRASES:
            if phrase.lower() in low:
                problems.append(f'{rel}: запретная фраза «{phrase}» — {why}')
        for m in re.finditer(r"[а-яё]{2,},[а-яё]{2,}", page.text, re.I):
            problems.append(f"{rel}: нет пробела после запятой — «{m.group()}»")
        # [^\S\n] — пробел, но не перевод строки: повтор ищем внутри
        # предложения, а не через границу блоков.
        for m in re.finditer(r"\b([А-Яа-яЁё]{4,})[^\S\n]+\1\b", page.text, re.I):
            problems.append(f"{rel}: повтор слова — «{m.group()}»")
        if page.text.count("«") != page.text.count("»"):
            problems.append(f"{rel}: непарные кавычки «»")

        # --- арифметика ---
        for pattern, check in ARITHMETIC_RULES:
            for m in re.finditer(pattern, page.text):
                if not check(m):
                    problems.append(f"{rel}: арифметика не сходится — «{m.group()}»")

    for t, where in titles.items():
        if len(where) > 1:
            problems.append(f"дубль title «{t}»: {', '.join(where)}")
    for d, where in descriptions.items():
        if len(where) > 1 and d:
            problems.append(f"дубль description: {', '.join(where)}")
    for anchor, targets in anchor_targets.items():
        if len(targets) > 1:
            problems.append(f"анкор «{anchor}» ведёт на {len(targets)} разных URL: {', '.join(sorted(targets))}")

    print(f"Проверено страниц: {len(files)}")
    if problems:
        print(f"\nНАРУШЕНИЙ: {len(problems)}\n")
        for p in problems:
            print("  •", p)
        return 1
    print("Нарушений нет.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
