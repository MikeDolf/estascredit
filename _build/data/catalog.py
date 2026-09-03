# -*- coding: utf-8 -*-
"""Каталог: типы вилочных погрузчиков и позиции внутри них.

Это справочник для подбора, а не витрина магазина. Мы не держим склад и не
устанавливаем цену, поэтому:

  * поля «в наличии» здесь нет — наличие подтверждает поставщик под конкретный
    запрос, и обещать его на сайте нельзя;
  * `budget` — ориентир для фильтра по бюджету, на странице он НЕ выводится.
    Показана «Цена по запросу»: назвать цену вправе только поставщик;
  * рейтинга у позиций нет и не будет, пока не появятся реальные оценки
    с источником. Звёзды у карточки с пометкой «Образец» — выдуманная оценка.

Фотографии лежат в `_build/photos/`, оптимизированные версии собирает
`make_images.py`. Поле `photo` — имя файла без суффикса ширины; альт берётся
из `photo_alt`. Внешне газовый и дизельный погрузчик не отличаются, поэтому
один и тот же снимок может стоять в разных категориях — это не ошибка.

Все позиции помечены `sample: True` — это образцы для проверки вёрстки и
фильтров, а не реальные предложения. Снимать пометку можно только вместе с
подстановкой настоящей модели, характеристик и фото.

ХАРАКТЕРИСТИКИ. Набор полей позиции описан в `SPECS` ниже — это единственный
источник правды и для карточки, и для фильтров. Добавили поле туда — оно само
появится в карточке и (если `filter: True`) в сайдбаре.

Фильтры собираются ИЗ ПОЗИЦИЙ, а не из справочника: в сайдбаре показываются
только те значения, которые реально есть у техники в этой категории. Иначе
человек ставит галочку «трёхопорный» и получает пустой экран — худший вид
фильтра. По той же причине фильтр с единственным значением не выводится
вообще: выбирать не из чего.

Поле, которого у позиции нет, не выдумывается: в карточке такой строки
просто не будет. У б/у техники год и наработка обязательны — без них
объявление не читается как честное.
"""

# Порядок здесь = порядок строк в карточке и порядок блоков в сайдбаре.
#
#   type "enum" — значение из списка `values`, выводится подписью из него;
#   type "num"  — число, выводится как есть с `unit`;
#   filter True — по характеристике можно отфильтровать выдачу.
#
# `values: None` у бренда — значения не фиксированы справочником, их собирает
# сборка из самих позиций (брендов на вторичном рынке десятки, держать их
# список тут значит забыть его обновить).
SPECS = [
    {"key": "condition", "label": "Состояние", "type": "enum", "filter": True,
     "values": [("new", "Новый"), ("used", "Б/у")]},
    {"key": "brand", "label": "Бренд", "type": "enum", "filter": True, "values": None},
    {"key": "mast", "label": "Мачта", "type": "enum", "filter": True,
     "values": [("two", "Двухсекционная"), ("three", "Трёхсекционная"),
                ("freelift", "Со свободным ходом")]},
    {"key": "tires", "label": "Шины", "type": "enum", "filter": True,
     "values": [("pneumatic", "Пневматические"), ("solid", "Цельнолитые")]},
    {"key": "wheels", "label": "Колёсная схема", "type": "enum", "filter": True,
     "values": [("three", "Трёхопорный"), ("four", "Четырёхопорный")]},
    {"key": "cabin", "label": "Кабина", "type": "enum", "filter": True,
     "values": [("open", "Открытая"), ("closed", "Закрытая, с отоплением")]},
    {"key": "battery", "label": "Аккумулятор", "type": "enum", "filter": True,
     "values": [("acid", "Свинцово-кислотный"), ("lithium", "Литиевый")]},
    {"key": "sideshift", "label": "Боковое смещение", "type": "enum", "filter": True,
     "values": [("yes", "Есть"), ("no", "Нет")]},
    {"key": "carriage", "label": "Класс каретки", "type": "enum", "filter": False,
     "values": [("2", "ISO 2"), ("3", "ISO 3")]},
    {"key": "aisle", "label": "Рабочий проход", "type": "num", "filter": False, "unit": " мм"},
    {"key": "year", "label": "Год выпуска", "type": "num", "filter": False, "unit": ""},
    {"key": "hours", "label": "Наработка", "type": "num", "filter": False, "unit": " м/ч"},
]

# Диапазоны для числовых фильтров. Формат значения — "низ-верх", верх пустой
# значит «и выше»; ту же строку разбирает JS.
LIFT_RANGES = [
    ("0-3300", "до 3,3 м"),
    ("3300-4500", "3,3–4,5 м"),
    ("4500-", "от 4,5 м"),
]


CATEGORIES = [
    {
        "slug": "elektricheskie",
        "card_note": "Без выхлопа, работают в помещении",
        "photo": "vilochnyy-pogruzchik-trekhopornyy",
        "photo_height": 1063,
        "photo_alt": "Электрический вилочный погрузчик с трёхопорной схемой",
        "name": "Электропогрузчики",
        "name_gen": "электропогрузчиков",
        "title": "Электрические вилочные погрузчики — подбор моделей",
        "description": "Электрические вилочные погрузчики: грузоподъёмность, высота подъёма и характеристики моделей. Подберём технику под задачи склада в Екатеринбурге и области.",
        "h1": "Электрические вилочные погрузчики",
        "intro": "",  # TODO: где применяют, чем отличаются, кому подходят
        "products": [
            {
                "name": "Электропогрузчик, 1,5 т",
                "photo": "vilochnyy-pogruzchik-trekhopornyy",
                "photo_height": 1063,
                "photo_alt": "Вилочный погрузчик с трёхопорной схемой, вид сбоку",
                "capacity": 1500,
                "lift_mm": 3000,
                "budget": 780000,
                "condition": "new",
                "brand": "Heli",
                "mast": "three",
                "tires": "solid",
                "wheels": "three",
                "cabin": "open",
                "battery": "lithium",
                "sideshift": "yes",
                "carriage": "2",
                "aisle": 3400,
                "desc": "",       # TODO
                "sample": True,
            },
            {
                "name": "Электропогрузчик, 3 т",
                "photo": "vilochnyy-pogruzchik-zheltyy",
                "photo_height": 632,
                "photo_alt": "Жёлтый вилочный погрузчик с поднятой мачтой, вид три четверти",
                "capacity": 3000,
                "lift_mm": 3300,
                "budget": 1250000,
                "condition": "new",
                "brand": "Hangcha",
                "mast": "two",
                "tires": "solid",
                "wheels": "four",
                "cabin": "open",
                "battery": "acid",
                "sideshift": "no",
                "carriage": "2",
                "aisle": 3900,
                "desc": "",
                "sample": True,
            },
            {
                "name": "Электропогрузчик, 2 т, б/у",
                "photo": "vilochnyy-pogruzchik-trekhopornyy",
                "photo_height": 1063,
                "photo_alt": "Подержанный электрический вилочный погрузчик, вид сбоку",
                "capacity": 2000,
                "lift_mm": 4500,
                "budget": 620000,
                "condition": "used",
                "brand": "Komatsu",
                "mast": "three",
                "tires": "solid",
                "wheels": "four",
                "cabin": "open",
                "battery": "acid",
                "sideshift": "yes",
                "carriage": "2",
                "aisle": 3700,
                "year": 2018,
                "hours": 6400,
                "desc": "",
                "sample": True,
            },
        ],
    },
    {
        "slug": "dizelnye",
        "card_note": "Для улицы и неровных площадок",
        "photo": "vilochnyy-pogruzchik-sinii",
        "photo_height": 800,
        "photo_alt": "Дизельный вилочный погрузчик с защитным навесом",
        "name": "Дизельные погрузчики",
        "name_gen": "дизельных погрузчиков",
        "title": "Дизельные вилочные погрузчики — подбор под вашу задачу",
        "description": "Дизельные вилочные погрузчики для работы на улице: грузоподъёмность, высота подъёма, характеристики моделей. Подберём технику под условия эксплуатации.",
        "h1": "Дизельные вилочные погрузчики",
        "intro": "",
        "products": [
            {
                "name": "Дизельный погрузчик, 2,5 т",
                "photo": "vilochnyy-pogruzchik-sinii",
                "photo_height": 800,
                "photo_alt": "Синий вилочный погрузчик с защитным навесом, вид три четверти",
                "capacity": 2500,
                "lift_mm": 3300,
                "budget": 1050000,
                "condition": "new",
                "brand": "Heli",
                "mast": "two",
                "tires": "pneumatic",
                "wheels": "four",
                "cabin": "open",
                "sideshift": "no",
                "carriage": "2",
                "aisle": 4100,
                "desc": "",
                "sample": True,
            },
            {
                "name": "Дизельный погрузчик, 3,5 т",
                "photo": "vilochnyy-pogruzchik-krasnyy",
                "photo_height": 640,
                "photo_alt": "Красный вилочный погрузчик с мачтой, вид сбоку",
                "capacity": 3500,
                "lift_mm": 3500,
                "budget": 1400000,
                "condition": "new",
                "brand": "LiuGong",
                "mast": "three",
                "tires": "pneumatic",
                "wheels": "four",
                "cabin": "closed",
                "sideshift": "yes",
                "carriage": "3",
                "aisle": 4400,
                "desc": "",
                "sample": True,
            },
            {
                "name": "Дизельный погрузчик, 5 т, б/у",
                "photo": "vilochnyy-pogruzchik-sinii",
                "photo_height": 800,
                "photo_alt": "Подержанный дизельный вилочный погрузчик, вид три четверти",
                "capacity": 5000,
                "lift_mm": 4500,
                "budget": 1650000,
                "condition": "used",
                "brand": "Toyota",
                "mast": "two",
                "tires": "pneumatic",
                "wheels": "four",
                "cabin": "closed",
                "sideshift": "yes",
                "carriage": "3",
                "aisle": 4800,
                "year": 2016,
                "hours": 11200,
                "desc": "",
                "sample": True,
            },
        ],
    },
    {
        "slug": "gazoballonnye",
        "card_note": "И в помещении, и на улице",
        "photo": "vilochnyy-pogruzchik-krasnyy",
        "photo_height": 640,
        "photo_alt": "Газобаллонный вилочный погрузчик с мачтой",
        "name": "Газобаллонные погрузчики",
        "name_gen": "газобаллонных погрузчиков",
        "title": "Газобаллонные вилочные погрузчики — подбор моделей",
        "description": "Газобаллонные вилочные погрузчики для помещения и улицы: грузоподъёмность, высота подъёма, характеристики. Подберём модель под ваши условия работы склада.",
        "h1": "Газобаллонные вилочные погрузчики",
        "intro": "",
        "products": [
            {
                "name": "Газобаллонный погрузчик, 2 т",
                "photo": "vilochnyy-pogruzchik-zheltyy",
                "photo_height": 632,
                "photo_alt": "Жёлтый вилочный погрузчик, вид три четверти",
                "capacity": 2000,
                "lift_mm": 3000,
                "budget": 980000,
                "condition": "new",
                "brand": "Hangcha",
                "mast": "two",
                "tires": "solid",
                "wheels": "four",
                "cabin": "open",
                "sideshift": "no",
                "carriage": "2",
                "aisle": 3800,
                "desc": "",
                "sample": True,
            },
            {
                "name": "Газобаллонный погрузчик, 1,2 т",
                "photo": "vilochnyy-pogruzchik-krasnyy",
                "photo_height": 640,
                "photo_alt": "Красный компактный вилочный погрузчик, вид сбоку",
                "capacity": 1200,
                "lift_mm": 3000,
                "budget": 750000,
                "condition": "new",
                "brand": "Heli",
                "mast": "two",
                "tires": "solid",
                "wheels": "three",
                "cabin": "open",
                "sideshift": "no",
                "carriage": "2",
                "aisle": 3300,
                "desc": "",
                "sample": True,
            },
            {
                "name": "Газобаллонный погрузчик, 3 т, б/у",
                "photo": "vilochnyy-pogruzchik-zheltyy",
                "photo_height": 632,
                "photo_alt": "Подержанный газобаллонный вилочный погрузчик, вид три четверти",
                "capacity": 3000,
                "lift_mm": 4000,
                "budget": 890000,
                "condition": "used",
                "brand": "Nissan",
                "mast": "three",
                "tires": "solid",
                "wheels": "four",
                "cabin": "open",
                "sideshift": "yes",
                "carriage": "2",
                "aisle": 4000,
                "year": 2017,
                "hours": 8900,
                "desc": "",
                "sample": True,
            },
        ],
    },
]

CAPACITY_RANGES = [
    ("0-1500", "до 1,5 т"),
    ("1500-3000", "1,5–3 т"),
    ("3000-", "от 3 т"),
]

LEAD_TYPES = [
    "Пока не определился",
    "Электропогрузчик",
    "Дизельный погрузчик",
    "Газобаллонный погрузчик",
]
