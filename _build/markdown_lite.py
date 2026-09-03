# -*- coding: utf-8 -*-
"""Маленький конвертер markdown -> HTML под конкретную форму этих статей.

Не общего назначения: рассчитан на то, что реально встречается в текстах —
абзацы, **жирный**, [ссылки](url), таблицы GFM, нумерованные/маркированные
списки, один blockquote-врезка на статью, разделители ---, и уже готовые
<h2 id="..."> прямо внутри markdown (их не трогаем, пропускаем как есть).
Полноценный парсер тут избыточен и добавил бы внешнюю зависимость туда,
где сейчас её осознанно нет (см. header build.py про jinja2).
"""
import re
import html as _html


def esc(s):
    return _html.escape(s, quote=False)


def inline(text, live_articles, root):
    """Инлайн-разметка внутри строки: жирный + ссылки."""
    # Ссылки [текст](url) — раньше жирного, чтобы не резать разметку внутри.
    def link(m):
        # label уже пришёл экранированным (html-safe) из вызывающего кода —
        # здесь только оборачиваем **жирный** внутри анкора, если он есть.
        label, url = m.group(1), m.group(2)
        label_html = re.sub(r'\*\*(.+?)\*\*', lambda b: '<strong>' + b.group(1) + '</strong>', label)
        if url.startswith('#'):
            return '<a href="{}">{}</a>'.format(url, label_html)
        m2 = re.match(r'^/articles/([a-z0-9\-]+)/$', url)
        if m2 and m2.group(1) in live_articles:
            return '<a href="{}articles/{}/">{}</a>'.format(root, m2.group(1), label_html)
        # Статья ещё не опубликована — ссылку не даём (битая ссылка хуже,
        # чем упоминание без гиперссылки), но текст анкора сохраняем.
        return label_html

    out = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    # Жирный вне ссылок (внутри уже обработан через link()).
    out = re.sub(r'\*\*(.+?)\*\*', lambda m: '<strong>' + m.group(1) + '</strong>', out)
    return out


def convert(body_md, live_articles, root="@ROOT@"):
    lines = body_md.split("\n")
    out = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Уже готовый HTML-заголовок — пропускаем как есть.
        if stripped.startswith('<h2 id='):
            out.append(stripped)
            i += 1
            continue

        # ### h3
        if stripped.startswith('### '):
            out.append('<h3>{}</h3>'.format(inline(esc(stripped[4:]), live_articles, root)))
            i += 1
            continue

        # ## h2 (используется только для "Содержание")
        if stripped.startswith('## '):
            out.append('<h2>{}</h2>'.format(inline(esc(stripped[3:]), live_articles, root)))
            i += 1
            continue

        # Разделитель
        if stripped == '---':
            i += 1
            continue

        # Врезка > **Коротко** ...
        if stripped.startswith('>'):
            buf = []
            while i < n and lines[i].strip().startswith('>'):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            inner = '<br>'.join(inline(esc(b), live_articles, root) for b in buf if b)
            out.append('<blockquote>{}</blockquote>'.format(inner))
            continue

        # Таблица GFM: строка с |, следующая — разделитель ---|---
        if stripped.startswith('|') and i + 1 < n and re.match(r'^\|[\s:\-|]+\|$', lines[i+1].strip()):
            header_cells = [c.strip() for c in stripped.strip('|').split('|')]
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            thead = ''.join('<th>{}</th>'.format(inline(esc(c), live_articles, root)) for c in header_cells)
            tbody = ''.join(
                '<tr>' + ''.join('<td>{}</td>'.format(inline(esc(c), live_articles, root)) for c in r) + '</tr>'
                for r in rows
            )
            out.append('<div class="table-wrap"><table><thead><tr>{}</tr></thead>'
                       '<tbody>{}</tbody></table></div>'.format(thead, tbody))
            continue

        # Нумерованный список
        if re.match(r'^\d+\.\s', stripped):
            items = []
            while i < n and re.match(r'^\d+\.\s', lines[i].strip()):
                items.append(re.sub(r'^\d+\.\s', '', lines[i].strip()))
                i += 1
            out.append('<ol>' + ''.join(
                '<li>{}</li>'.format(inline(esc(it), live_articles, root)) for it in items
            ) + '</ol>')
            continue

        # Маркированный список
        if stripped.startswith('- '):
            items = []
            while i < n and lines[i].strip().startswith('- '):
                items.append(lines[i].strip()[2:])
                i += 1
            out.append('<ul>' + ''.join(
                '<li>{}</li>'.format(inline(esc(it), live_articles, root)) for it in items
            ) + '</ul>')
            continue

        # Обычный абзац — собираем строки до пустой строки.
        buf = [stripped]
        i += 1
        while i < n and lines[i].strip() and not lines[i].strip().startswith(('<h2', '#', '>', '|', '- ')) \
                and not re.match(r'^\d+\.\s', lines[i].strip()) and lines[i].strip() != '---':
            buf.append(lines[i].strip())
            i += 1
        out.append('<p>{}</p>'.format(inline(esc(' '.join(buf)), live_articles, root)))

    return '\n'.join(out)
