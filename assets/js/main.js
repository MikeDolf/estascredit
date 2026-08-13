// SINOTECH / estascredit.ru — shared page behaviour.
// Every helper below checks for its element first, so this one file can be
// safely included on every page (landing, articles listing, single article).

document.addEventListener('DOMContentLoaded', () => {

  // Mobile burger toggle
  const burger = document.querySelector('.burger');
  const mainnav = document.querySelector('.mainnav');
  if (burger && mainnav) {
    burger.addEventListener('click', () => {
      const isOpen = mainnav.style.display === 'flex';
      mainnav.style.display = isOpen ? 'none' : 'flex';
      mainnav.style.cssText += 'position:absolute; top:100%; left:0; right:0; background:#171b1d; flex-direction:column; padding:24px 32px; gap:18px; border-bottom:1px solid #2a3134;';
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    if (item.classList.contains('open')) { a.style.maxHeight = a.scrollHeight + 'px'; }
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Lead form fake submit (no backend wired up yet — replace with a real endpoint later)
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      [...leadForm.children].forEach(c => { if (!c.classList.contains('form-success')) c.style.display = 'none'; });
      const success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
    });
  }

  // Sticky header shadow on scroll
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 40 ? '0 8px 24px rgba(0,0,0,0.3)' : 'none';
    });
  }
});
