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
  // No backend wired up yet — replace with a real endpoint later.
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      [...leadForm.children].forEach(c => {
        if (!c.classList.contains('form-success')) c.style.display = 'none';
      });
      const success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
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
