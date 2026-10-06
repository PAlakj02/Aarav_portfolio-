// Shared navigation — edit this list to change the menu on every page.
const NAV = [
  { label: 'Home', href: 'index.html' },
  {
    label: 'Projects & Outreach', href: 'projects.html', overview: 'All Projects', children: [
      { label: 'Smart Irrigation', href: 'smart-irrigation.html' },
      { label: 'Arsenic Filtration', href: 'arsenic-filtration.html' },
      { label: 'Plarick', href: 'plarick.html' },
      { label: 'Science that Wins Matches', href: 'science-that-wins-matches.html' },
      { label: 'Microplastics Filtration', href: 'microplastics-filtration.html' },
    ],
  },
  {
    label: 'Research Paper', href: 'research.html', overview: 'All Research Papers', children: [
      { label: 'Bioinformatics-Based Microplastics Filtration', href: 'research-microplastics.html' },
      { label: 'Lead Filtration', href: 'research-lead-filtration.html' },
    ],
  },
  {
    label: 'Beyond Academics', children: [
      { label: 'Awards & Honours', href: 'awards-and-honours.html' },
      { label: 'Leadership', href: 'leadership.html' },
      { label: 'Personal Accolades', href: 'personal-accolades.html' },
      { label: 'Pre-Professional Experiences', href: 'pre-professional-experiences.html' },
    ],
  },
  { label: 'Contact', href: 'contact.html' },
];

const CARET = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

function buildNav() {
  const page = currentPage();
  const items = NAV.map((item, i) => {
    if (!item.children) {
      const active = item.href === page ? ' class="active"' : '';
      return `<li${active}><a href="${item.href}">${item.label}</a></li>`;
    }
    const isActive = item.href === page || item.children.some(c => c.href === page);
    const overview = item.href
      ? `<li><a class="dropdown-overview${item.href === page ? ' current' : ''}" href="${item.href}">${item.overview}</a></li>` : '';
    const links = item.children.map(c =>
      `<li><a href="${c.href}"${c.href === page ? ' class="current"' : ''}>${c.label}</a></li>`).join('');
    return `<li class="has-dropdown${isActive ? ' active' : ''}">
      <button type="button" aria-expanded="false" aria-controls="dd-${i}">${item.label}${CARET}</button>
      <ul class="dropdown" id="dd-${i}">${overview}${links}</ul>
    </li>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <nav class="nav" aria-label="Main">
      <a class="logo" href="index.html" aria-label="Aarav Jain — home"><span class="filled">A</span><span class="outline">J</span><span class="dot"></span></a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <ul class="nav-links">${items}</ul>
    </nav>`;
  document.body.prepend(header);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `© ${new Date().getFullYear()} Aarav Jain`;
  document.body.append(footer);

  const isDesktop = () => window.matchMedia('(min-width: 901px)').matches;
  const dropdowns = header.querySelectorAll('.has-dropdown');

  const setOpen = (li, open) => {
    li.classList.toggle('open', open);
    li.querySelector('button').setAttribute('aria-expanded', String(open));
  };
  const closeAll = except => dropdowns.forEach(li => li !== except && setOpen(li, false));

  dropdowns.forEach(li => {
    const btn = li.querySelector('button');
    btn.addEventListener('click', e => {
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

buildNav();
