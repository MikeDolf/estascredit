// УралФорклифт / estascredit.ru — общее поведение страниц.
// Каждый обработчик сначала проверяет, есть ли его элемент, поэтому файл
// безопасно подключать на любую страницу.

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile navigation -------------------------------------------------
  // The dropdown is driven by a CSS class, never by inline styles: inline
  // styles would survive a resize and leave the desktop nav stuck as a
  // floating column.
  const burger = document.querySelector('.burger');
  const mainnav = document.querySelector('.mainnav');

  if (burger && mainnav) {
    const setNav = (open) => {
      mainnav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };

    burger.addEventListener('click', () => {
      setNav(!mainnav.classList.contains('open'));
    });

    // Tapping a link closes the menu (in-page anchors would otherwise leave
    // the panel covering the section the user just jumped to).
    mainnav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setNav(false));
    });

    // Esc закрывает меню и возвращает фокус на бургер: без этого человек
    // с клавиатуры остаётся заперт в открытой панели.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainnav.classList.contains('open')) {
        setNav(false);
        burger.focus();
      }
    });

    // Leaving the mobile breakpoint resets the menu to its default state.
    const desktop = window.matchMedia('(min-width: 1121px)');
    const syncNav = () => { if (desktop.matches) setNav(false); };
    desktop.addEventListener('change', syncNav);
    syncNav();
  }

  // ---- FAQ accordion -----------------------------------------------------
  const faqItems = [...document.querySelectorAll('.faq-item')];

  const openFaq = (item) => {
    const answer = item.querySelector('.faq-a');
    item.classList.add('open');
    item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  };

  const closeFaq = (item) => {
    item.classList.remove('open');
    item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    item.querySelector('.faq-a').style.maxHeight = null;
  };

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

    if (item.classList.contains('open')) openFaq(item);
    else question.setAttribute('aria-expanded', 'false');

    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      faqItems.filter(i => i.classList.contains('open')).forEach(closeFaq);
      if (!wasOpen) openFaq(item);
    });
  });

  // ---- Resize handling ---------------------------------------------------
  // An open answer keeps a pixel max-height, which goes stale when the text
  // reflows taller on a narrower screen (rotating a phone clips it).
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      faqItems.filter(i => i.classList.contains('open')).forEach(item => {
        const answer = item.querySelector('.faq-a');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      });
    }, 150);
  });

  // ---- Форма заявки ------------------------------------------------------
  // Адрес прослойки приходит из data-атрибута, который проставляет сборка,
  // а значение живёт в _build/data/site.py. Раньше оно было записано здесь
  // второй копией и могло разойтись с тем, что показывает страница.
  const LEAD_ENDPOINT = document.body.dataset.leadEndpoint || '';

  // Форм на коммерческой странице две — короткая в середине и полная внизу.
  // Обработчик ищет поля внутри своей формы, а не по глобальному id, иначе
  // вторая форма забирала бы значения у первой.
  document.querySelectorAll('form.lead').forEach(leadForm => {
    const val = (name) => {
      const el = leadForm.querySelector(`[data-field="${name}"]`);
      return el ? el.value : '';
    };

    const showSuccess = () => {
      [...leadForm.children].forEach(c => {
        if (!c.classList.contains('form-success')) c.style.display = 'none';
      });
      const success = leadForm.querySelector('.form-success');
      if (success) success.style.display = 'block';
    };

    const MAX_PROFILE = 'https://max.ru/u/f9LHodD0cOKyteShoHfqvWGvhHp9vSpUfIj5eQ3q74zQVsWDDMYXDy23WNQ';

    // Контейнер размечен в HTML с role="alert" и лежит НАД кнопкой: раньше
    // сообщение вставлялось под ней мелким серым текстом, и на телефоне
    // с открытой клавиатурой оказывалось за краем экрана.
    const showMessage = (text, isError, withLink) => {
      const box = leadForm.querySelector('#formMsg');
      if (!box) return;
      box.textContent = text;
      box.hidden = false;
      box.classList.toggle('is-error', !!isError);
      if (withLink) {
        box.appendChild(document.createTextNode(' '));
        const link = document.createElement('a');
        link.href = MAX_PROFILE;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Написать в MAX';
        box.appendChild(link);
      }
      box.scrollIntoView({ block: 'nearest' });
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Нативная валидация первой: браузер подсветит конкретное поле и
      // покажет подсказку рядом с ним. Общий текст под формой этого не даёт.
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        showMessage('Заполните имя и телефон — без них мы не сможем ответить.', true);
        return;
      }

      if (!LEAD_ENDPOINT) {
        showMessage('Отправка формы пока не подключена. Напишите нам:', true, true);
        return;
      }

      const btn = leadForm.querySelector('button[type="submit"]');
      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }

      try {
        const res = await fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: val('name'), phone: val('phone'), type: val('type'),
            brand: val('brand'), comment: val('comment'),
            company: val('company'),             // honeypot, люди его не видят
            page: location.pathname,
          }),
        });
        if (!res.ok) throw new Error(res.status);
        showSuccess();
      } catch {
        showMessage('Не удалось отправить заявку.', true, true);
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  });

  // ---- Catalog filters -----------------------------------------------
  // Filters read data-* attributes off each .product-card and toggle
  // .is-hidden — no re-render, so it works the same with 4 sample cards
  // now and 400 real ones later.
  const productGrid = document.querySelector('.product-grid');
  const filtersPanel = document.querySelector('.filters');

  if (productGrid && filtersPanel) {
    const cards = [...productGrid.querySelectorAll('.product-card')];
    const catBoxes = [...filtersPanel.querySelectorAll('[data-filter-group="cat"]')];
    const rangeBoxes = [...filtersPanel.querySelectorAll('[data-filter-group="range"]')];
    const specBoxes = [...filtersPanel.querySelectorAll('[data-filter-group="spec"]')];
    const stockBox = filtersPanel.querySelector('[data-filter-group="instock"]');
    const priceMin = filtersPanel.querySelector('[data-filter-group="price-min"]');
    const priceMax = filtersPanel.querySelector('[data-filter-group="price-max"]');
    const resetBtn = filtersPanel.querySelector('.filters-reset');
    const countEl = document.querySelector('.sort-bar .count');
    const catIconBtns = [...document.querySelectorAll('.cat-icon-btn')];
    const allBoxes = [...catBoxes, ...rangeBoxes, ...specBoxes, stockBox].filter(Boolean);

    // Галочки одной характеристики — это ИЛИ («трёх- или четырёхопорный»),
    // а разные характеристики — И («трёхопорный И литиевый»). Поэтому
    // сначала группируем по data-attr, потом проверяем каждую группу.
    const groupBy = (boxes) => {
      const map = new Map();
      boxes.filter(b => b.checked).forEach(b => {
        const attr = b.dataset.attr;
        if (!map.has(attr)) map.set(attr, []);
        map.get(attr).push(b.value);
      });
      return map;
    };

    // Диапазон вида "1500-3000" или "3000-" (без верхней границы).
    const inRange = (num, ranges) => ranges.some(r => {
      const [lo, hi] = r.split('-');
      return num >= (Number(lo) || 0) && num <= (hi ? Number(hi) : Infinity);
    });

    const applyFilters = () => {
      const activeCats = catBoxes.filter(b => b.checked).map(b => b.value);
      const activeRanges = groupBy(rangeBoxes);
      const activeSpecs = groupBy(specBoxes);
      const stockOnly = stockBox ? stockBox.checked : false;
      const min = priceMin && priceMin.value ? Number(priceMin.value) : 0;
      const max = priceMax && priceMax.value ? Number(priceMax.value) : Infinity;

      let visible = 0;
      cards.forEach(card => {
        const price = Number(card.dataset.price || 0);
        let ok = true;

        if (activeCats.length && !activeCats.includes(card.dataset.cat || '')) ok = false;
        if (stockOnly && card.dataset.instock !== '1') ok = false;
        if (price < min || price > max) ok = false;

        activeRanges.forEach((values, attr) => {
          if (!inRange(Number(card.dataset[attr] || 0), values)) ok = false;
        });

        // Позиция без этой характеристики не проходит фильтр по ней: у б/у
        // техники без указанного года «Год выпуска» — это неизвестность,
        // а не совпадение с любым выбранным значением.
        activeSpecs.forEach((values, attr) => {
          const own = card.dataset['spec' + attr.charAt(0).toUpperCase() + attr.slice(1)];
          if (!own || !values.includes(own)) ok = false;
        });

        card.classList.toggle('is-hidden', !ok);
        if (ok) visible++;
      });

      if (countEl) countEl.textContent = `Показано ${visible} из ${cards.length}`;
      document.querySelectorAll('.catalog-pagination .count').forEach(el => {
        el.textContent = `Показано ${visible} из ${cards.length}`;
      });

      let empty = productGrid.querySelector('.product-empty');
      if (!visible) {
        if (!empty) {
          empty = document.createElement('p');
          empty.className = 'product-empty';
          empty.textContent = 'Под такие параметры в примерах ничего нет — опишите задачу, подберём под неё.';
          productGrid.appendChild(empty);
        }
        empty.hidden = false;
      } else if (empty) {
        empty.hidden = true;
      }

      catIconBtns.forEach(btn => btn.classList.toggle('active', activeCats.includes(btn.dataset.cat)));
    };

    allBoxes.forEach(el => el.addEventListener('change', applyFilters));
    [priceMin, priceMax].filter(Boolean).forEach(el => {
      el.addEventListener('input', applyFilters);
    });

    // Icon strip is a shortcut into the matching sidebar checkbox, not a
    // second source of truth — one filter state, two entry points.
    catIconBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const box = catBoxes.find(b => b.value === btn.dataset.cat);
        if (box) {
          box.checked = !box.checked;
          applyFilters();
        }
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        allBoxes.forEach(b => { b.checked = false; });
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        applyFilters();
      });
    }

    // Mobile: filters live behind a toggle button instead of a sticky sidebar.
    const filtersToggle = document.querySelector('.filters-toggle');
    if (filtersToggle) {
      filtersToggle.addEventListener('click', () => {
        const open = filtersPanel.classList.toggle('open');
        filtersToggle.setAttribute('aria-expanded', String(open));
      });
    }

    applyFilters();
  }

  // ---- Catalog sort --------------------------------------------------
  const sortSelect = document.querySelector('.sort-bar select[data-sort]');
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = [...productGrid.querySelectorAll('.product-card')];
      const key = sortSelect.value;
      const sorted = cards.sort((a, b) => {
        if (key === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
        if (key === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
        if (key === 'capacity') return Number(b.dataset.capacity) - Number(a.dataset.capacity);
        return Number(a.dataset.order) - Number(b.dataset.order); // "по умолчанию"
      });
      sorted.forEach(card => productGrid.appendChild(card));
    });
  }

  // ---- Кнопка «Подобрать» --------------------------------------------
  // Корзины и оформления заказа здесь нет и быть не может: технику мы не
  // продаём. Кнопка подставляет позицию в форму заявки и ведёт к ней.
  document.querySelectorAll('.product-actions [data-buy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const leadForm = document.getElementById('leadForm');
      if (card && leadForm) {
        const typeField = leadForm.querySelector('[data-field="type"]');
        const brandField = leadForm.querySelector('[data-field="brand"]');
        const commentField = leadForm.querySelector('[data-field="comment"]');
        const name = card.querySelector('h3')?.textContent.trim() || '';
        const typeByCat = { elektro: 'Электропогрузчик', dizel: 'Дизельный погрузчик', gaz: 'Газобаллонный погрузчик' };
        if (typeField && typeByCat[card.dataset.cat]) typeField.value = typeByCat[card.dataset.cat];
        if (brandField) brandField.value = name;
        if (commentField && !commentField.value) {
          commentField.value = `Интересует: ${name}`;
        }
      }
      document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---- Sticky header shadow ---------------------------------------------
  const header = document.querySelector('header');
  if (header) {
    let ticking = false;
    const applyShadow = () => {
      header.style.boxShadow = window.scrollY > 40 ? '0 6px 20px rgba(0,0,0,0.08)' : 'none';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(applyShadow); }
    }, { passive: true });
  }
});
