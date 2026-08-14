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
ASSET_VERSION = 6

# --- Факты о бизнесе -------------------------------------------------------
# Заполняются владельцем. Рыночные данные конкурентов сюда не переносятся:
# опубликовать можно только то, по чему компания реально сможет отработать.
LEGAL_NAME = None          # ООО «…»
INN = None
OGRN = None
LEGAL_ADDRESS = None
OFFICE_ADDRESS = None

PHONE = None               # обычный телефон не публикуем
EMAIL = None               # почту с сайта убрали
TELEGRAM = None
WHATSAPP = None

# Основной и единственный канал связи — мессенджер MAX.
MAX_PHONE = "+7 950 646-09-53"
MAX_PHONE_RAW = "+79506460953"
# Прямая ссылка на профиль в MAX. Появится, когда будет известен username —
# до тех пор показываем номер, его добавляют в MAX вручную.
MAX_LINK = None

# На страницах показываем только значок и слово MAX. Номер остаётся в href —
# без него ссылка не сработает, поэтому от сборщиков адресов это не прячет.
CONTACT_LABEL = "MAX"
CONTACT_HREF = MAX_LINK or f"tel:{MAX_PHONE_RAW}"

CONTACT_ICON = (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6'
    'A8.4 8.4 0 0 1 3.6 11.5a8.4 8.4 0 0 1 8.4-8.4h.5a8.4 8.4 0 0 1 8.5 8.4z"/></svg>'
)
CONTACT_LINK = (
    f'<a class="contact-max" href="{CONTACT_HREF}" aria-label="Связаться в MAX">'
    f'{CONTACT_ICON}{CONTACT_LABEL}</a>'
)

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
    if MAX_LINK is None:
        gaps.append("MAX_LINK (прямая ссылка на профиль, пока только номер)")
    return gaps
