/**
 * Приём заявок с сайта и отправка их в MAX.
 *
 * Зачем нужна эта прослойка. Сайт статический (GitHub Pages), сервера у него
 * нет. Обратиться к MAX Bot API напрямую из браузера нельзя: токен бота попал
 * бы в исходный код страницы, его увидел бы любой посетитель и рассылал бы от
 * вашего имени. Поэтому токен живёт здесь, в переменных окружения, а браузер
 * общается только с этим адресом.
 *
 * РАЗВЁРТЫВАНИЕ (Cloudflare Workers, бесплатного тарифа хватает):
 *   1. npm i -g wrangler && wrangler login
 *   2. wrangler deploy _relay/worker.js --name estascredit-lead
 *   3. wrangler secret put MAX_BOT_TOKEN
 *      wrangler secret put MAX_CHAT_ID
 *   4. Полученный адрес вида https://estascredit-lead.<ваш>.workers.dev
 *      прописать в assets/js/main.js → LEAD_ENDPOINT
 *
 * Тот же код без изменений работает как Yandex Cloud Function — там переменные
 * задаются в интерфейсе функции.
 *
 * ПЕРЕД ЗАПУСКОМ СВЕРИТЬ С ОФИЦИАЛЬНОЙ ДОКУМЕНТАЦИЕЙ MAX: базовый адрес и имена
 * полей ниже взяты из открытых описаний API и могли измениться. Порядок
 * регистрации бота тоже уточните — с августа 2025 публикация ботов доступна
 * только верифицированным российским юрлицам.
 */

const MAX_API = "https://platform-api.max.ru";

// Домены, которым разрешено слать заявки. Без этого списка форму с вашим
// адресом сможет дёргать кто угодно со своего сайта.
const ALLOWED_ORIGINS = [
  "https://estascredit.ru",
  "https://www.estascredit.ru",
];

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function clean(value, limit) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = { ...cors(origin), "Content-Type": "application/json" };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors(origin) });
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "bad_json" }), { status: 400, headers });
    }

    // Honeypot: поле скрыто от людей, но боты его заполняют. Отвечаем 200,
    // чтобы бот считал отправку успешной и не пробовал снова.
    if (clean(data.company, 100)) {
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    const name = clean(data.name, 80);
    const phone = clean(data.phone, 40);
    if (!name || !phone) {
      return new Response(JSON.stringify({ error: "name_and_phone_required" }), { status: 400, headers });
    }

    const lines = [
      "Заявка с estascredit.ru",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      clean(data.type, 80) ? `Тип техники: ${clean(data.type, 80)}` : null,
      clean(data.brand, 80) ? `Бренд/модель: ${clean(data.brand, 80)}` : null,
      clean(data.comment, 800) ? `Комментарий: ${clean(data.comment, 800)}` : null,
      clean(data.page, 200) ? `Страница: ${clean(data.page, 200)}` : null,
    ].filter(Boolean);

    const res = await fetch(`${MAX_API}/messages?chat_id=${encodeURIComponent(env.MAX_CHAT_ID)}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.MAX_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: lines.join("\n") }),
    });

    if (!res.ok) {
      // Заявку терять нельзя: пишем в лог, чтобы её можно было достать руками.
      console.error("MAX API error", res.status, await res.text(), lines.join(" | "));
      return new Response(JSON.stringify({ error: "delivery_failed" }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { headers });
  },
};
