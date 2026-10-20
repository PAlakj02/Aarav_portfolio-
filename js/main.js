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
    label: 'Research Papers', children: [
      { label: 'Bioinformatics-Based Microplastic Filtration', href: 'research-microplastics.html' },
      { label: 'Lead Filtration', href: 'research-lead-filtration.html' },
    ],
  },
  {
    label: 'Beyond Academics', children: [
      { label: 'Leadership', href: 'leadership.html' },
      { label: 'Courses & Pre-Professional Experiences', href: 'pre-professional-experiences.html' },
    ],
  },
  { label: 'Awards', href: 'awards.html' },
  { label: 'Contact', href: 'contact.html' },
];

const EMAIL = '2008aaravjain@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/'; // TODO: replace with Aarav's LinkedIn profile URL

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

// No backend: "Send" opens the visitor's email app with the message filled in.
function wireContactForm(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const note = form.querySelector('.form-note');
    const { name, email, message } = Object.fromEntries(new FormData(form));
    if (!name.trim() || !email.trim() || !message.trim()) { note.textContent = 'Please fill in your name, email and message.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { note.textContent = 'Please enter a valid email address.'; return; }
    const subject = `Website enquiry from ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Opening your email app… If nothing happens, write to ' + EMAIL;
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
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-text">If you are interested in innovation,<br>design, outreach or the environment,<br>please contact me.<br>We can collaborate and create more<br>solutions for the future.</div>
      <div class="footer-contact">
        <button class="mail-btn" type="button" data-contact aria-label="Open contact form">${ENVELOPE}</button>
        <div class="footer-links">
          <a href="mailto:${EMAIL}">${EMAIL}</a>
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

// PowerPoint files can't open in a browser tab, so send them through Office's online viewer.
function wireOfficeLinks() {
  document.querySelectorAll('a[data-office]').forEach(a => {
    if (location.protocol.startsWith('http') && !/^(localhost|127\.)/.test(location.hostname)) {
      a.href = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(new URL(a.getAttribute('href'), location.href).href);
    }
  });
}

// Fade sections in as they scroll into view; unfold the crushed paper once.
function wireReveals() {
  const els = document.querySelectorAll('.reveal, .paper.crushed');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in', 'unfold')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    if (el.classList.contains('paper')) { el.classList.remove('crushed'); el.classList.add('unfold'); }
    else el.classList.add('in');
    io.unobserve(el);
  }), { threshold: 0.18 });
  els.forEach(el => io.observe(el));
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

buildNav();
buildFooter();
wireOfficeLinks();
wireReveals();
wireAwards();
