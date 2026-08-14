// SINOTECH / estascredit.ru — shared page behaviour.
// Every helper below checks for its element first, so this one file can be
// safely included on every page (landing, articles listing, single article).

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

  // ---- Lead form ---------------------------------------------------------
  // Адрес прослойки, которая складывает заявку в MAX. Пока он пустой, форма
  // НЕ показывает «заявка принята»: показать успех и никуда не отправить —
  // значит потерять обращение и оставить человека ждать ответа, которого
  // не будет. Разворачивается из _relay/worker.js.
  const LEAD_ENDPOINT = '';

  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    const val = (id) => (document.getElementById(id) || {}).value || '';

    const showSuccess = () => {
      [...leadForm.children].forEach(c => {
        if (!c.classList.contains('form-success')) c.style.display = 'none';
      });
      const success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
    };

    const showMessage = (text, isError) => {
      let box = leadForm.querySelector('.form-msg');
      if (!box) {
        box = document.createElement('p');
        box.className = 'form-msg form-note';
        leadForm.insertBefore(box, leadForm.querySelector('.form-note'));
      }
      box.textContent = text;
      box.style.color = isError ? '#ff7a45' : '#4fd8c4';
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!val('f-name').trim() || !val('f-phone').trim()) {
        showMessage('Заполните имя и телефон — без них мы не сможем ответить.', true);
        return;
      }

      if (!LEAD_ENDPOINT) {
        showMessage('Форма пока не подключена. Напишите нам в MAX: +7 950 646-09-53', true);
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
            name: val('f-name'), phone: val('f-phone'), type: val('f-type'),
            brand: val('f-brand'), comment: val('f-comment'),
            company: val('f-company'),           // honeypot, люди его не видят
            page: location.pathname,
          }),
        });
        if (!res.ok) throw new Error(res.status);
        showSuccess();
      } catch {
        showMessage('Не удалось отправить заявку. Напишите нам в MAX: +7 950 646-09-53', true);
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  }

  // ---- Sticky header shadow ---------------------------------------------
  const header = document.querySelector('header');
  if (header) {
    let ticking = false;
    const applyShadow = () => {
      header.style.boxShadow = window.scrollY > 40 ? '0 8px 24px rgba(0,0,0,0.3)' : 'none';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(applyShadow); }
    }, { passive: true });
  }
});
