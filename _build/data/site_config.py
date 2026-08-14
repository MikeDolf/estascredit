"""Единый источник истины по сайту.

Правило раздела 2.1 мастер-промпта: чего нет — то помечается как «нет данных»
и не выдумывается. Поля со значением None считаются незакрытыми; сборка о них
предупреждает, а шаблоны такие блоки не рендерят вовсе.
"""

DOMAIN = "estascredit.ru"
BASE_URL = f"https://{DOMAIN}"

BRAND = "СИНОТЕХ"
BRAND_TAGLINE = "import machinery"

# Версию поднимать при КАЖДОЙ правке CSS/JS, иначе вернувшийся посетитель
# получит старый файл из кэша поверх новой разметки.
ASSET_VERSION = 3

# --- Факты о бизнесе -------------------------------------------------------
# Заполняются владельцем. Рыночные данные конкурентов сюда не переносятся:
# опубликовать можно только то, по чему компания реально сможет отработать.
LEGAL_NAME = None          # ООО «…»
INN = None
OGRN = None
LEGAL_ADDRESS = None
OFFICE_ADDRESS = None

PHONE = None               # None = телефон не публикуем
EMAIL = "info@estascredit.ru"
TELEGRAM = None
WHATSAPP = None

MIN_ORDER = None           # напр. "1 единица"
WORK_HOURS = "Пн–Вс 9:00–20:00 (МСК)"

# Собственные цены. Пока None — блок цены на страницах не рендерится,
# вместо него честное «рассчитываем по заявке».
OWN_PRICES_CONFIRMED = False

# Сроки, которые компания готова зафиксировать в договоре.
DELIVERY_DAYS = None       # напр. (25, 45)
WARRANTY = None            # напр. "12 месяцев или 1000 моточасов"
LEASING = None             # напр. "от 14% годовых, аванс от 10%, 12–60 мес."


def missing_facts() -> list[str]:
    """Что осталось незакрытым. Сборка печатает это в конце каждого прогона."""
    gaps = []
    for name in ("LEGAL_NAME", "INN", "OGRN", "LEGAL_ADDRESS",
                 "MIN_ORDER", "DELIVERY_DAYS", "WARRANTY", "LEASING"):
        if globals()[name] is None:
            gaps.append(name)
    if not OWN_PRICES_CONFIRMED:
        gaps.append("OWN_PRICES_CONFIRMED")
    if PHONE is None and TELEGRAM is None and WHATSAPP is None:
        gaps.append("канал связи (кроме почты не задан ни один)")
    return gaps
