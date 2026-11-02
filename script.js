(() => {
  'use strict';
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const breakpoint = window.matchMedia('(max-width: 820px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('[data-motion-toggle]');
  let manualReduce = false;
  const motionIsReduced = () => reducedMotion.matches || manualReduce;
  function syncMotion() {
    root.dataset.motion = motionIsReduced() ? 'reduce' : 'full';
    motionToggle?.setAttribute('aria-pressed', String(motionIsReduced()));
    if (motionToggle) motionToggle.textContent = reducedMotion.matches ? 'Reduced motion (system)' : (manualReduce ? 'Restore motion' : 'Reduce motion');
    if (motionToggle) motionToggle.disabled = reducedMotion.matches;
  }
  motionToggle?.addEventListener('click', () => { manualReduce = !manualReduce; syncMotion(); portal?.style.removeProperty('--progress'); });
  syncMotion();
  root.classList.add('enhanced');

  function setMenu(open, returnFocus = false) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
    if (returnFocus) toggle.focus();
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (nav?.classList.contains('open') && !header.contains(event.target)) setMenu(false);
  });
  header?.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  breakpoint.addEventListener('change', () => setMenu(false));

  const portal = document.querySelector('[data-portal]');
  const hero = document.querySelector('.hero');
  let queued = false;
  function updateScroll() {
    header?.classList.toggle('scrolled', window.scrollY > 16);
    if (portal && hero && !motionIsReduced()) {
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      portal.style.setProperty('--progress', progress.toFixed(3));
    }
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  reducedMotion.addEventListener('change', () => { syncMotion(); portal?.style.removeProperty('--progress'); updateScroll(); });
  updateScroll();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    root.classList.add('motion-ready');
  }

  document.querySelectorAll('[data-switcher]').forEach(switcher => {
    const buttons = [...switcher.querySelectorAll('[data-choice]')];
    const panels = [...switcher.querySelectorAll('[data-panel]')];
    const activate = button => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      panels.forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.choice; });
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); buttons[next].focus(); activate(buttons[next]); }
      });
    });
    activate(buttons[0]);
  });

  const form = document.querySelector('[data-enquiry]');
  if (!form) return;
  const fields = [...form.querySelectorAll('[required]')];
  const status = document.querySelector('#form-status');
  let draft = '';
  const preview = document.querySelector('[data-draft]');

  function errorFor(field) {
    if (!field.value.trim()) return field.name === 'message' ? 'Please add a note.' : `Please enter your ${field.name}.`;
    if (field.validity.typeMismatch) return 'Please enter a valid email address.';
    return '';
  }
  function validate(field) {
    const message = errorFor(field);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    document.querySelector(`#${field.id}-error`).textContent = message;
    return !message;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validate(field);
  }));
  form.addEventListener('input', () => {
    if (!preview.hidden) {
      preview.hidden = true; draft = '';
      status.textContent = 'Your note changed. Prepare the draft again to include your edits.';
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      preview.hidden = true;
      status.textContent = 'Please check the highlighted fields.';
      fields.find(field => errorFor(field)).focus();
      return;
    }
    const data = new FormData(form);
    const subject = `RAMBA enquiry — ${String(data.get('interest'))}`;
    const body = `Name: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\nInterest: ${data.get('interest')}\n\n${String(data.get('message')).trim()}`;
    draft = `To: stay@ramba.example (placeholder address)\nSubject: ${subject}\n\n${body}\n\nThis draft has not been sent.`;
    document.querySelector('#draft-text').value = draft;
    document.querySelector('[data-mail-link]').href = `mailto:stay@ramba.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    preview.hidden = false;
    status.textContent = 'Draft prepared locally. Nothing has been sent.';
    document.querySelector('[data-draft-title]').focus();
  });
  document.querySelector('[data-save-draft]').addEventListener('click', () => {
    if (!draft) return;
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'RAMBA-enquiry-draft.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'A draft file was created on your device. Nothing has been sent.';
  });
})();
