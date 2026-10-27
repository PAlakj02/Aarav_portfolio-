// Shared navigation — edit this list to change the menu on every page.
const NAV = [
  { label: 'About', href: 'index.html' },
  {
    label: 'Projects & Outreach', children: [
      { label: 'FarmTech for Rural India', href: 'smart-irrigation.html' },
      { label: 'Arsenic and Heavy Metal Filtration', href: 'arsenic-filtration.html' },
      { label: 'Plarick – Recycled Plastic Bricks', href: 'plarick.html' },
      { label: 'STEM in Action', href: 'stem-in-action.html' },
    ],
  },
  {
    label: 'Research', children: [
      { label: 'Bioinformatics-Based Microplastic Filtration', href: 'research-microplastics.html' },
      { label: 'Lead Filtration', href: 'research-lead-filtration.html' },
    ],
  },
  { label: 'Courses & Internships', href: 'pre-professional-experiences.html' },
  { label: 'Awards', href: 'awards.html' },
  { label: 'Contact', href: 'contact.html' },
];

const EMAIL = '2008aaravjain@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/aarav-jain-a96514319/';

const CARET = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const ENVELOPE = '<svg viewBox="0 0 64 46" aria-hidden="true"><rect x="2" y="2" width="60" height="42" rx="3" fill="none" stroke="#D4603A" stroke-width="3"/><path d="M3 4l29 24L61 4M3 43l22-20M61 43L39 23" fill="none" stroke="#D4603A" stroke-width="3"/></svg>';

function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p.endsWith('.html') ? p : p + '.html';
}

function buildNav() {
  const page = currentPage();
  const items = NAV.map((item, i) => {
    if (!item.children) {
      const active = item.href === page || (item.also || []).includes(page) ? ' class="active"' : '';
      return `<li${active}><a href="${item.href}">${item.label}</a></li>`;
    }
    const isActive = item.children.some(c => c.href === page);
    const links = item.children.map(c =>
      `<li><a href="${c.href}"${c.href === page ? ' class="current"' : ''}>${c.label}</a></li>`).join('');
    return `<li class="has-dropdown${isActive ? ' active' : ''}">
      <button type="button" aria-expanded="false" aria-controls="dd-${i}">${item.label}${CARET}</button>
      <ul class="dropdown" id="dd-${i}">${links}</ul>
    </li>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <nav class="nav" aria-label="Main">
      <a class="logo" href="index.html" aria-label="Aarav Jain — home"><img src="images/logo.png" alt="AJ" width="60" height="60"></a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <ul class="nav-links">${items}</ul>
    </nav>`;
  document.body.prepend(header);

  const isDesktop = () => window.matchMedia('(min-width: 1001px)').matches;
  const dropdowns = header.querySelectorAll('.has-dropdown');
  const setOpen = (li, open) => {
    li.classList.toggle('open', open);
    li.querySelector('button').setAttribute('aria-expanded', String(open));
  };
  const closeAll = except => dropdowns.forEach(li => li !== except && setOpen(li, false));

  dropdowns.forEach(li => {
    li.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      const open = !li.classList.contains('open');
      closeAll(li);
      setOpen(li, open);
    });
    let t;
    li.addEventListener('mouseenter', () => { if (isDesktop()) { clearTimeout(t); closeAll(li); setOpen(li, true); } });
    li.addEventListener('mouseleave', () => { if (isDesktop()) t = setTimeout(() => setOpen(li, false), 150); });
  });

  document.addEventListener('click', e => { if (!header.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  const toggle = header.querySelector('.menu-toggle');
  const links = header.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function contactFormHTML(id) {
  return `
    <h2 class="git-title" id="${id}-title">GET IN TOUCH</h2>
    <p class="git-sub">Whether you have a question about my projects, want to collaborate, or just want to say hello, I’d love to hear from you.</p>
    <form class="contact-form" novalidate>
      <input name="name" type="text" placeholder="Name" aria-label="Name" required autocomplete="name">
      <input name="email" type="email" placeholder="Email" aria-label="Email" required autocomplete="email">
      <textarea name="message" placeholder="Message" aria-label="Message" required></textarea>
      <button class="btn" type="submit">Send</button>
      <p class="form-note" aria-live="polite"></p>
    </form>`;
}

// No backend: FormSubmit.co emails the message straight to Aarav. If that fails, fall back to the visitor's email app.
function wireContactForm(form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const note = form.querySelector('.form-note');
    const btn = form.querySelector('button[type="submit"]');
    const { name, email, message } = Object.fromEntries(new FormData(form));
    if (!name.trim() || !email.trim() || !message.trim()) { note.textContent = 'Please fill in your name, email and message.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { note.textContent = 'Please enter a valid email address.'; return; }
    const subject = `Website enquiry from ${name}`;
    btn.disabled = true;
    note.textContent = 'Sending…';
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: subject, _replyto: email, _template: 'table', _captcha: 'false' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'send failed');
      form.reset();
      note.textContent = 'Thank you! Your message has been sent.';
    } catch {
      const body = `${message}\n\n— ${name} (${email})`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Opening your email app… If nothing happens, write to ' + EMAIL;
    } finally {
      btn.disabled = false;
    }
  });
}

function buildFooter() {
  // "Let's Connect" only on the Contact page.
  if (currentPage() === 'contact.html') {
    const connect = document.createElement('div');
    connect.className = 'connect';
    connect.innerHTML = `<a class="connect-pill" href="contact.html" data-contact>Let’s Connect</a>`;
    document.body.append(connect);
  }

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  // Home page uses a single slim bar: envelope + email + LinkedIn.
  if (document.body.classList.contains('home')) footer.classList.add('slim');
  footer.innerHTML = footer.classList.contains('slim') ? `
    <div class="footer-slim">
      <button class="mail-btn" type="button" data-contact aria-label="Open contact form">${ENVELOPE}</button>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <a class="linkedin" href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">Linked<span>in</span></a>
    </div>` : `
    <div class="footer-inner">
      <div class="footer-text">If you are interested in innovation,<br>design, outreach or the environment,<br>please contact me.<br>We can collaborate and create more<br>solutions for the future.</div>
      <div class="footer-contact">
        <div class="footer-links">
          <div class="mail-col">
            <button class="mail-btn" type="button" data-contact aria-label="Open contact form">${ENVELOPE}</button>
            <a href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
          <a class="linkedin" href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">Linked<span>in</span></a>
        </div>
      </div>
    </div>`;
  document.body.append(footer);

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'm-title');
  modal.innerHTML = `<div class="modal-box"><button class="modal-close" type="button" aria-label="Close">&times;</button>${contactFormHTML('m')}</div>`;
  document.body.append(modal);
  wireContactForm(modal.querySelector('form'));

  let lastFocus;
  const open = () => { lastFocus = document.activeElement; modal.classList.add('open'); setTimeout(() => modal.querySelector('input').focus(), 50); };
  const close = () => { modal.classList.remove('open'); lastFocus?.focus(); };
  document.querySelectorAll('[data-contact]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(); }));
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal-close')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

  const pageForm = document.getElementById('contact-page');
  if (pageForm) { pageForm.innerHTML = contactFormHTML('p'); wireContactForm(pageForm.querySelector('form')); }
}

// Slow fade-up as each block scrolls into view (jayveerkochhar.com style: one element at a time, 1.25s).
const REVEAL = [
  'main .page-title', 'main .lead', 'main .proj-head', 'main .award-won', 'main .pill', 'main .section > p',
  'main .section > ul', 'main img', 'main .card', 'main .btn', 'main .boxed', 'main .entry', 'main .h2',
  'main .programs', 'main .plants figure', 'main .research > p', 'main .chem > p', 'main .text > p',
  'main .stem-top p', 'main .aw-head', 'main .aw-cat', 'main .aw-cert', 'main .big-link', 'main .tested',
].join(',');
function wireReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  // Skip anything inside a block that is already animating, so nothing fades twice.
  const els = [...document.querySelectorAll(REVEAL)].filter((el, _, all) => !all.some(p => p !== el && p.contains(el)));
  let batch = 0;
  const io = new IntersectionObserver(entries => {
    entries.filter(en => en.isIntersecting).forEach(en => {
      en.target.style.transitionDelay = `${Math.min(batch++, 6) * 0.12}s`;
      en.target.classList.add('in');
      // Once it has arrived, hand back to the element's own hover transitions.
      en.target.addEventListener('transitionend', () => {
        en.target.classList.remove('reveal', 'in');
        en.target.style.transitionDelay = '';
      }, { once: true });
      io.unobserve(en.target);
    });
    batch = 0;
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

// Awards: categories drop down on hover (click/tap also works).
function wireAwards() {
  document.querySelectorAll('.aw-cat').forEach(cat => {
    const btn = cat.querySelector('.aw-toggle');
    const set = open => { cat.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
    const hoverable = () => window.matchMedia('(hover: hover)').matches;
    cat.addEventListener('mouseenter', () => hoverable() && set(true));
    cat.addEventListener('mouseleave', () => hoverable() && set(false));
    btn.addEventListener('click', () => set(hoverable() || !cat.classList.contains('open')));
  });
}

// Vercel Web Analytics: page views, countries, referrers and devices (enable it in the Vercel project's Analytics tab).
function loadAnalytics() {
  if (!/^(localhost|127\.)/.test(location.hostname) && location.protocol.startsWith('http')) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.append(s);
  }
}

loadAnalytics();
buildNav();
buildFooter();
wireReveals();
wireAwards();
