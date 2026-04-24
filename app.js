// ============ Utilities ============
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else if (k === 'dataset') Object.assign(e.dataset, attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

// ============ Render Timeline ============
(function renderTimeline() {
  const ul = document.getElementById('timeline-list');
  if (!ul) return;
  window.TIMELINE.forEach(row => {
    const li = el('li', { class: 'grid grid-cols-12 gap-4 py-2 hover:bg-black/[0.02] transition-colors' });
    li.innerHTML = `
      <div class="col-span-3 md:col-span-2 font-mono text-[12px] num pt-[2px]" style="color:var(--ink-faint)">${row.year}</div>
      <div class="col-span-9 md:col-span-7 text-[14px] leading-[1.6]">${row.title}</div>
      <div class="hidden md:block md:col-span-3 font-mono text-[11px] text-right pt-[2px]" style="color:var(--ink-muted)">${row.role}</div>
    `;
    ul.appendChild(li);
  });
})();

// ============ Render Commercial Tabs + Grid ============
const commercialState = { cat: 'All', layout: 'grid' };

function renderCommercialTabs() {
  const bar = document.getElementById('commercial-tabs');
  bar.innerHTML = '';
  window.COMMERCIAL_CATEGORIES.forEach((c, i) => {
    const btn = el('button', {
      class: 'tab-btn pb-2',
      'data-active': String(c.id === commercialState.cat),
      onclick: () => { commercialState.cat = c.id; renderCommercialTabs(); renderCommercialGrid(); }
    });
    btn.innerHTML = `<span style="color:var(--ink-faint)" class="mr-1.5 num">0${i+1}</span>${c.label}`;
    bar.appendChild(btn);
  });
}

function renderCommercialGrid() {
  const grid = document.getElementById('commercial-grid');
  const count = document.getElementById('commercial-count');
  const cat = commercialState.cat;
  const items = window.COMMERCIAL_PROJECTS.filter(p => cat === 'All' || p.category.includes(cat));
  count.textContent = String(items.length).padStart(2, '0') + ' PROJECTS';

  grid.innerHTML = '';
  if (commercialState.layout === 'grid') {
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14';
    items.forEach((p, i) => grid.appendChild(commercialCardGrid(p, i)));
  } else {
    grid.className = 'border-t border-hairline';
    items.forEach((p, i) => grid.appendChild(commercialRowList(p, i)));
  }
}

function coverSVG(title, year, isDark=false) {
  // decorative placeholder cover — subtle hairline + monospace caption
  const fg = isDark ? '#BEBEB5' : '#6B6B6B';
  const faint = isDark ? '#8A8A85' : '#A0A0A0';
  return `
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
      <defs>
        <pattern id="p_${encodeURIComponent(title)}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="${faint}" stroke-width="0.6" opacity="0.35"/>
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#p_${encodeURIComponent(title)})"/>
      <rect x="28" y="28" width="584" height="304" fill="none" stroke="${fg}" stroke-width="0.8" stroke-dasharray="3 4"/>
      <text x="44" y="56" font-family="JetBrains Mono, monospace" font-size="11" fill="${fg}" letter-spacing="1">COVER · N/A</text>
      <text x="596" y="56" font-family="JetBrains Mono, monospace" font-size="11" fill="${fg}" text-anchor="end">${year}</text>
      <circle cx="320" cy="180" r="46" stroke="${fg}" stroke-width="0.8" fill="none"/>
      <circle cx="320" cy="180" r="22" stroke="${fg}" stroke-width="0.8" fill="none" stroke-dasharray="2 3"/>
      <text x="320" y="320" font-family="Instrument Serif, serif" font-style="italic" font-size="15" fill="${fg}" text-anchor="middle">— ${title.slice(0,24)} —</text>
    </svg>
  `;
}

function commercialCardGrid(p, i) {
  const idx = String(i + 1).padStart(2, '0');
  const a = el('a', {
    class: 'work-card group block',
    href: p.link, target: '_blank', rel: 'noopener'
  });
  a.innerHTML = `
    <div class="relative aspect-[16/9] overflow-hidden rounded-[10px] cover-ph border border-hairline mb-4">
      <div class="absolute inset-0 cover-img">
        ${p.cover
          ? `<img src="${p.cover}" alt="${escapeHTML(p.title)}" class="w-full h-full object-cover"/>`
          : coverSVG(p.title, p.year)
        }
      </div>
      <div class="absolute top-3 left-3 font-mono text-[10px] tracking-widest" style="color:var(--ink-muted)">
        <span class="num">${idx}</span> · ${p.category[0].toUpperCase()}
      </div>
      <div class="absolute top-3 right-3 font-mono text-[10px]" style="color:var(--ink-muted)">
        ${p.year}
      </div>
      ${p.featured ? `<div class="absolute bottom-3 left-3 font-mono text-[9px] px-2 py-[3px] rounded-full bg-accent text-white">FEATURED</div>` : ''}
    </div>
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-[17px] leading-[1.35] font-medium">
        <span class="work-title-underline">${escapeHTML(p.title)}</span>
      </h3>
      <span class="work-arrow font-mono text-[13px] pt-[2px]" style="color:var(--ink-muted)">↗</span>
    </div>
    <div class="font-mono text-[11px] mt-1" style="color:var(--ink-faint)">${escapeHTML(p.subtitle)}</div>
    <p class="text-[13px] leading-[1.75] mt-2" style="color:var(--ink-muted)">${escapeHTML(truncate(p.desc, 84))}</p>
    <div class="flex flex-wrap gap-1.5 mt-3">
      ${p.tags.map(t => `<span class="chip">${escapeHTML(t)}</span>`).join('')}
    </div>
  `;
  return a;
}

function commercialRowList(p, i) {
  const idx = String(i + 1).padStart(2, '0');
  const a = el('a', {
    class: 'work-card block border-b border-hairline py-5 group',
    href: p.link, target: '_blank', rel: 'noopener'
  });
  a.innerHTML = `
    <div class="grid grid-cols-12 gap-4 items-baseline">
      <div class="col-span-1 font-mono text-[11px] num" style="color:var(--ink-faint)">${idx}</div>
      <div class="col-span-6 md:col-span-5">
        <div class="text-[16px] leading-[1.35] font-medium"><span class="work-title-underline">${escapeHTML(p.title)}</span></div>
        <div class="font-mono text-[11px] mt-1" style="color:var(--ink-faint)">${escapeHTML(p.subtitle)}</div>
      </div>
      <div class="hidden md:flex md:col-span-4 gap-1.5 flex-wrap">
        ${p.tags.slice(0,4).map(t => `<span class="chip">${escapeHTML(t)}</span>`).join('')}
      </div>
      <div class="col-span-4 md:col-span-1 font-mono text-[11px] text-right num" style="color:var(--ink-muted)">${p.year}</div>
      <div class="col-span-1 text-right work-arrow font-mono text-[14px]" style="color:var(--ink-muted)">↗</div>
    </div>
  `;
  return a;
}

// ============ Render Personal ============
function renderPersonal() {
  const list = document.getElementById('personal-list');
  list.innerHTML = '';
  window.PERSONAL_PROJECTS.forEach(p => list.appendChild(personalCard(p)));
}

function personalCard(p) {
  const kindLabel = p.kind;
  const a = el('a', {
    class: 'personal-card work-card block border rounded-[12px] overflow-hidden group transition-colors',
    href: p.link, target: '_blank', rel: 'noopener'
  });
  a.innerHTML = `
    <!-- COVER : 16:9 banner -->
    <div class="aspect-[16/9] relative overflow-hidden border-b hairline-personal flex items-center justify-center" style="background: rgba(255,255,255,0.02)">
      <div class="absolute top-3 left-3 font-mono text-[10px] tracking-widest flex items-center gap-2" style="opacity:.7">
        <span class="num" style="opacity:.65">${p.number}</span>
        <span>·</span>
        <span>${kindLabel}</span>
      </div>
      <div class="absolute top-3 right-3 font-mono text-[10px]" style="opacity:.7">${p.year}</div>

      <div class="absolute bottom-3 left-3 font-mono text-[9px]" style="opacity:.4">+</div>
      <div class="absolute bottom-3 right-3 font-mono text-[9px]" style="opacity:.4">+</div>

      <div class="cover-img flex items-center justify-center w-full h-full">
        ${p.cover
          ? `<img src="${p.cover}" alt="${escapeHTML(p.title)}" class="w-full h-full object-cover"/>`
          : personalPlaceholder(p.kind)
        }
      </div>

      ${p.featured ? `<div class="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] px-2 py-[3px] rounded-full bg-accent text-white">FEATURED</div>` : ''}
    </div>

    <!-- BODY -->
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-1">
        <h3 class="text-[18px] leading-[1.3] font-medium tracking-[-0.005em]">
          <span class="work-title-underline">${escapeHTML(p.title)}</span>
        </h3>
        <span class="work-arrow font-mono text-[13px] pt-[3px]" style="opacity:.7">↗</span>
      </div>
      <div class="font-mono text-[11px]" style="opacity:.6">${escapeHTML(p.subtitle)}</div>

      <p class="text-[13px] leading-[1.75] mt-3" style="color:var(--ink-muted)">${escapeHTML(truncate(p.desc, 110))}</p>

      <!-- CTA -->
      <div class="mt-4 font-mono text-[10px] inline-flex items-center gap-2 px-[10px] py-[5px] rounded-full border" style="border-color:currentColor;opacity:.85">
        <span>${escapeHTML(p.linkLabel)}</span>
      </div>
    </div>
  `;
  return a;
}

function personalPlaceholder(kind) {
  // different subtle mono illustration per kind
  if (kind === 'COMIC') {
    // Comic: 3-panel manga strip
    return `<svg viewBox="0 0 320 180" class="h-[62%] w-auto" style="opacity:.75">
      <rect x="20" y="20" width="90" height="140" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <rect x="120" y="20" width="90" height="64" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <rect x="120" y="94" width="90" height="66" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <rect x="220" y="20" width="80" height="140" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <circle cx="65" cy="75" r="14" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M 55 110 Q 65 120 75 110" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="260" cy="75" r="10" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="2 2"/>
      <line x1="135" y1="48" x2="195" y2="48" stroke="currentColor" stroke-width="0.8"/>
      <line x1="135" y1="58" x2="180" y2="58" stroke="currentColor" stroke-width="0.8"/>
    </svg>`;
  }
  if (kind === 'TOOL') {
    // Tool: app window + sidebar
    return `<svg viewBox="0 0 320 180" class="h-[72%] w-auto" style="opacity:.75">
      <rect x="20" y="20" width="280" height="140" rx="8" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <line x1="20" y1="44" x2="300" y2="44" stroke="currentColor" stroke-width="1"/>
      <line x1="80" y1="44" x2="80" y2="160" stroke="currentColor" stroke-width="1"/>
      <circle cx="34" cy="32" r="2.5" fill="currentColor"/>
      <circle cx="44" cy="32" r="2.5" fill="currentColor"/>
      <circle cx="54" cy="32" r="2.5" fill="currentColor"/>
      <rect x="32" y="58" width="36" height="6" fill="currentColor" opacity="0.55"/>
      <rect x="32" y="72" width="36" height="6" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="32" y="86" width="36" height="6" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="32" y="100" width="36" height="6" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="96" y="58" width="130" height="8" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="96" y="74" width="188" height="8" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="96" y="90" width="110" height="8" stroke="currentColor" stroke-width="0.8" fill="none"/>
      <rect x="96" y="114" width="60" height="22" rx="4" fill="currentColor" opacity="0.7"/>
    </svg>`;
  }
  // GAME: pixel scene
  return `<svg viewBox="0 0 320 180" class="h-[72%] w-auto" style="opacity:.75">
    <rect x="20" y="20" width="280" height="140" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <!-- ground -->
    <line x1="20" y1="130" x2="300" y2="130" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4"/>
    <!-- pixel blocks -->
    <rect x="40" y="100" width="14" height="14" fill="currentColor"/>
    <rect x="54" y="86" width="14" height="14" fill="currentColor"/>
    <rect x="68" y="72" width="14" height="14" fill="currentColor"/>
    <rect x="82" y="86" width="14" height="14" fill="currentColor"/>
    <rect x="96" y="100" width="14" height="14" fill="currentColor"/>
    <!-- sun -->
    <circle cx="240" cy="56" r="14" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <!-- d-pad buttons bottom right -->
    <rect x="220" y="108" width="14" height="14" stroke="currentColor" stroke-width="1" fill="none"/>
    <rect x="236" y="108" width="14" height="14" stroke="currentColor" stroke-width="1" fill="none"/>
    <rect x="252" y="108" width="14" height="14" fill="currentColor" opacity="0.55"/>
    <rect x="268" y="108" width="14" height="14" stroke="currentColor" stroke-width="1" fill="none"/>
    <!-- character -->
    <rect x="156" y="110" width="10" height="20" fill="currentColor"/>
    <rect x="152" y="98" width="18" height="12" fill="currentColor"/>
  </svg>`;
}

// ============ Helpers ============
function escapeHTML(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[m]);
}
function truncate(s, n) { return s.length > n ? s.slice(0, n) + '…' : s; }

// ============ Section nav highlight ============
(function () {
  const links = document.querySelectorAll('.nav-pill, .rail-item');
  const sections = ['hero','about','commercial','personal','contact'].map(id => document.getElementById(id));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.setAttribute('data-on', String(l.dataset.target === e.target.id)));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => s && io.observe(s));
})();

// ============ Layout toggle ============
document.getElementById('layout-toggle')?.addEventListener('click', () => {
  commercialState.layout = commercialState.layout === 'grid' ? 'list' : 'grid';
  renderCommercialGrid();
});

// ============ Tweaks ============
(function () {
  const panel = document.getElementById('tweaks-panel');

  const FONT_MAP = {
    vt323:      { family: "'VT323', 'DotGothic16', monospace",                 weight: 400, tracking: '0em' },
    press:      { family: "'Press Start 2P', 'DotGothic16', monospace",       weight: 400, tracking: '0.02em' },
    silkscreen: { family: "'Silkscreen', 'DotGothic16', monospace",           weight: 700, tracking: '0.02em' },
    jersey:     { family: "'Jersey 15', 'DotGothic16', monospace",            weight: 400, tracking: '0.01em' },
    chakra:     { family: "'Chakra Petch', 'Noto Sans TC', sans-serif",       weight: 600, tracking: '0em' },
    dotgothic:  { family: "'DotGothic16', 'VT323', monospace",                weight: 400, tracking: '0em' },
  };

  function applyTweaks(t) {
    document.documentElement.style.setProperty('--accent', t.accent);
    document.body.setAttribute('data-personal-dark', String(t.personalDark));
    commercialState.layout = t.commercialLayout || 'grid';
    renderCommercialGrid();

    // display font
    const f = FONT_MAP[t.displayFont] || FONT_MAP.vt323;
    document.documentElement.style.setProperty('--display-font', f.family);
    document.documentElement.style.setProperty('--display-weight', f.weight);
    document.documentElement.style.setProperty('--display-tracking', f.tracking);

    // update UI
    document.querySelectorAll('.tweaks-swatch').forEach(el => {
      el.setAttribute('data-on', String(el.dataset.accent === t.accent));
    });
    const dk = document.getElementById('tw-dark');
    if (dk) {
      dk.setAttribute('data-on', String(t.personalDark));
      document.getElementById('tw-dark-state').textContent = t.personalDark ? 'ON' : 'OFF';
    }
    document.querySelectorAll('[data-layout]').forEach(el => {
      el.setAttribute('data-on', String(el.dataset.layout === commercialState.layout));
    });
    document.querySelectorAll('[data-font]').forEach(el => {
      el.setAttribute('data-on', String(el.dataset.font === (t.displayFont || 'vt323')));
    });
  }

  function persist(patch) {
    Object.assign(window.__TWEAKS, patch);
    applyTweaks(window.__TWEAKS);
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch(e) {}
  }

  // listeners
  document.querySelectorAll('.tweaks-swatch').forEach(el => {
    el.addEventListener('click', () => persist({ accent: el.dataset.accent }));
  });
  document.getElementById('tw-dark')?.addEventListener('click', () => {
    persist({ personalDark: !window.__TWEAKS.personalDark });
  });
  document.querySelectorAll('[data-layout]').forEach(el => {
    el.addEventListener('click', () => persist({ commercialLayout: el.dataset.layout }));
  });
  document.querySelectorAll('[data-font]').forEach(el => {
    el.addEventListener('click', () => persist({ displayFont: el.dataset.font }));
  });
  document.getElementById('tweaks-close')?.addEventListener('click', () => {
    panel.setAttribute('data-open', 'false');
    try { window.parent.postMessage({ type: '__deactivate_edit_mode' }, '*'); } catch(e) {}
  });

  // Register edit-mode protocol — listener first, then announce
  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === '__activate_edit_mode') panel.setAttribute('data-open', 'true');
    if (d.type === '__deactivate_edit_mode') panel.setAttribute('data-open', 'false');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e) {}

  // initial apply
  applyTweaks(window.__TWEAKS);
})();

// ============ Init ============
renderCommercialTabs();
renderCommercialGrid();
renderPersonal();
