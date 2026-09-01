#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Подготовка изображений: фотографии техники, картинка для соцсетей, иконка.

    python3 _build/make_images.py

Оригиналы лежат в `_build/photos/` и в вёрстку не попадают. Отсюда они
раскладываются в `assets/img/` в двух ширинах (800 и 1600 px) в формате WebP —
это то, чего требует on-page-seo.md: WebP, вес до 200 КБ, атрибуты width и
height, srcset для плотных экранов.

Ресайз делает системный `sips`, кодирование в WebP — `cwebp`
(`brew install webp`). Это инструменты сборки картинок: на сам сайт и на
`build.py` зависимостей они не добавляют, готовые .webp лежат в репозитории.
Если `cwebp` не установлен, скрипт скажет об этом и ничего не сломает.

apple-touch-icon рисуется кодом (zlib + struct): для сплошного ромба
фотография не нужна, а тянуть Pillow ради одной плашки — лишнее.
"""

import shutil
import struct
import subprocess
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(__file__).resolve().parent / "photos"
OUT = ROOT / "assets/img"

BG = (246, 247, 248)
ORANGE = (232, 80, 15)

# Ширины под сетку карточек: карточка занимает ~380 px, 800 закрывает её
# с запасом, 1600 — та же картинка для экранов с двойной плотностью.
WIDTHS = (800, 1600)
QUALITY = "78"

# Из какой фотографии делать обложку для соцсетей. Взят кадр без логотипов
# на технике: обложка представляет нас, а не чужой бренд.
COVER_SOURCE = "vilochnyy-pogruzchik-zheltyy"


def require_cwebp():
    if shutil.which("cwebp") is None:
        sys.exit("Нет cwebp — поставьте: brew install webp libtiff")


def sips(*args):
    r = subprocess.run(["sips", *args], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("sips не справился: {}".format(r.stderr.strip()))
    return r


def size_of(path):
    r = sips("-g", "pixelWidth", "-g", "pixelHeight", str(path))
    w = h = 0
    for line in r.stdout.splitlines():
        if "pixelWidth:" in line:
            w = int(line.split(":")[1])
        if "pixelHeight:" in line:
            h = int(line.split(":")[1])
    return w, h


def make_photos():
    """Каждое фото — в двух ширинах WebP. Возвращает размеры для вёрстки."""
    require_cwebp()
    OUT.mkdir(parents=True, exist_ok=True)
    made = {}

    for src in sorted(SRC.glob("*.jpeg")):
        name = src.stem
        sw, sh = size_of(src)
        for width in WIDTHS:
            dest = OUT / "{}-{}.webp".format(name, width)
            # sips уменьшает и отдаёт PNG во временный файл, cwebp кодирует:
            # sips умеет читать webp, но записывать его не умеет.
            tmp = OUT / "{}-{}.tmp.png".format(name, width)
            sips(str(src), "--resampleWidth", str(width),
                 "-s", "format", "png", "--out", str(tmp))
            r = subprocess.run(["cwebp", "-quiet", "-q", QUALITY, str(tmp),
                                "-o", str(dest)], capture_output=True, text=True)
            tmp.unlink(missing_ok=True)
            if r.returncode != 0:
                sys.exit("cwebp не справился: {}".format(r.stderr.strip()))
            kb = dest.stat().st_size / 1024
            flag = "" if kb < 200 else "  ← больше 200 КБ, снизьте QUALITY"
            print("  {:<44} {:>6.0f} КБ{}".format(dest.name, kb, flag))
        # Пропорции берём из оригинала: width/height в теге <img> нужны,
        # чтобы браузер зарезервировал место и страница не прыгала.
        made[name] = (WIDTHS[0], round(WIDTHS[0] * sh / sw))
    return made


def make_cover():
    """Обложка 1200×630 для Open Graph и Twitter Card.

    JPEG, а не WebP: часть краулеров соцсетей и мессенджеров WebP всё ещё
    не разбирает, а обложка должна открываться везде.
    """
    src = SRC / "{}.jpeg".format(COVER_SOURCE)
    dest = ROOT / "assets/og/cover.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    # Сначала подгоняем ширину, затем режем по центру до нужной высоты.
    sips(str(src), "--resampleWidth", "1200",
         "-s", "format", "jpeg", "-s", "formatOptions", "80", "--out", str(dest))
    sips("-c", "630", "1200", str(dest))
    print("  {:<44} {:>6.0f} КБ".format("og/cover.jpg", dest.stat().st_size / 1024))


def write_png(path, width, height, pixel_fn):
    rows = bytearray()
    for y in range(height):
        rows.append(0)
        for x in range(width):
            rows.extend(pixel_fn(x, y))

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(rows), 9))
           + chunk(b"IEND", b""))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)
    return len(png)


def make_icon():
    """apple-touch-icon: тот же силуэт, что в шапке и в favicon.

    Рисуется вручную, потому что растеризовать SVG в macOS нечем без
    дополнительных пакетов. Фигуры простые — прямоугольники и круги, их
    легко проверить попиксельно.
    """
    S = 180
    k = S / 100.0  # координаты те же, что в SVG, только в масштабе

    rects = [(44, 14, 46, 7), (83, 14, 7, 38), (44, 14, 7, 26),
             (28, 10, 7, 66), (21, 40, 6, 36), (4, 70, 24, 6),
             (40, 54, 12, 22), (52, 44, 31, 32)]
    circles = [(50, 80, 9), (78, 80, 9)]

    def pixel(x, y):
        u, v = x / k, y / k
        for rx, ry, rw, rh in rects:
            if rx <= u <= rx + rw and ry <= v <= ry + rh:
                return ORANGE
        for cx, cy, r in circles:
            if (u - cx) ** 2 + (v - cy) ** 2 <= r * r:
                return ORANGE
        return BG

    dest = ROOT / "assets/icons/apple-touch-icon.png"
    print("  {:<44} {:>6.0f} КБ".format("icons/apple-touch-icon.png",
                                        write_png(dest, S, S, pixel) / 1024))


def main():
    print("Фотографии техники:")
    made = make_photos()
    print("\nОбложка и иконка:")
    make_cover()
    make_icon()

    print("\nРазмеры для вёрстки (ширина 800):")
    for name, (w, h) in sorted(made.items()):
        print("  {:<40} {}×{}".format(name, w, h))
    return 0


if __name__ == "__main__":
    sys.exit(main())
