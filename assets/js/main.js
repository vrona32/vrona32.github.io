/* ===========================================================
   CartoGIS — wspólna logika strony
   - renderuje nagłówek i stopkę (jeden szablon dla wszystkich stron)
   - obsługuje motyw jasny/ciemny
   - ładuje dane projektów i wpisów z plików JSON i buduje karty
   =========================================================== */

/* --- Konfiguracja: zmień pod siebie ------------------------------------ */
const SITE = {
  name: "CartoGIS",
  tagline: "Kartografia · GIS · analizy przestrzenne",
  author: "CartoGIS",
  year: 2026,
  social: {
    github:    "https://github.com/vrona32",
    instagram: "https://www.instagram.com/cartogis/",
    reddit:    "https://www.reddit.com/user/Vroni_Zyris/",
    linkedin:  "https://www.linkedin.com/in/maciekwrona/",
    email:     "mailto:cartogis.works@gmail.com",
  },
};

/* --- Wykrycie ścieżki bazowej (działa też w podkatalogach /projects /blog) --- */
const BASE = location.pathname.includes("/projects/") || location.pathname.includes("/blog/") ? "../" : "./";

/* --- Ikony SVG (inline, bez zewnętrznych zależności) ------------------- */
const ICON = {
  logo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11 4 4 7v21l7-3 10 3 7-3V4l-7 3-10-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M11 4v21M21 7v21" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="16" cy="15" r="2.4" fill="currentColor"/></svg>`,
  sun:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`,
  burger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9V9Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  reddit: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-6.994 4.87-3.865 0-6.994-2.176-6.994-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.11-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
};

/* --- Motyw ------------------------------------------------------------- */
(function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) document.documentElement.classList.add("dark");
})();
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

/* --- Nagłówek ---------------------------------------------------------- */
function renderHeader(active) {
  const links = [
    ["Start", "index.html"],
    ["Portfolio", "portfolio.html"],
    ["Blog", "blog.html"],
    ["O mnie", "about.html"],
  ];
  const nav = links.map(([label, href]) =>
    `<a href="${BASE}${href}"${href === active ? ' class="active"' : ""}>${label}</a>`
  ).join("");

  const header = document.getElementById("site-header");
  if (!header) return;
  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav">
      <a class="brand" href="${BASE}index.html">${ICON.logo}<span>Carto<b>GIS</b></span></a>
      <nav class="nav-links" id="nav-links">${nav}</nav>
      <div style="display:flex;align-items:center">
        <button class="theme-toggle" id="theme-toggle" aria-label="Przełącz motyw">
          <span class="icon-moon">${ICON.moon}</span><span class="icon-sun">${ICON.sun}</span>
        </button>
        <button class="nav-burger" id="nav-burger" aria-label="Menu">${ICON.burger}</button>
      </div>
    </div>`;

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("nav-burger").addEventListener("click", () =>
    document.getElementById("nav-links").classList.toggle("open"));
}

/* --- Stopka ------------------------------------------------------------ */
function renderFooter() {
  const s = SITE.social;
  const social = [
    s.github    && `<a href="${s.github}" aria-label="GitHub" target="_blank" rel="noopener">${ICON.github}</a>`,
    s.instagram && `<a href="${s.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${ICON.instagram}</a>`,
    s.reddit    && `<a href="${s.reddit}" aria-label="Reddit" target="_blank" rel="noopener">${ICON.reddit}</a>`,
    s.linkedin  && `<a href="${s.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener">${ICON.linkedin}</a>`,
    s.email     && `<a href="${s.email}" aria-label="E-mail">${ICON.mail}</a>`,
  ].filter(Boolean).join("");

  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-inner">
      <div>
        <div class="brand" style="margin-bottom:6px">${ICON.logo}<span>Carto<b>GIS</b></span></div>
        <div class="muted" style="font-size:.9rem">© ${SITE.year} ${SITE.author}. ${SITE.tagline}.</div>
      </div>
      <div class="footer-social">${social}</div>
    </div>`;
}

/* --- Sekcja kontaktu z ikonami (strona "O mnie") ---------------------- */
function renderContact(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const s = SITE.social;
  const items = [
    s.github    && { icon: ICON.github,    label: "GitHub",    href: s.github,    blank: true },
    s.instagram && { icon: ICON.instagram, label: "Instagram", href: s.instagram, blank: true },
    s.linkedin  && { icon: ICON.linkedin,  label: "LinkedIn",  href: s.linkedin,  blank: true },
    s.reddit    && { icon: ICON.reddit,    label: "Reddit",    href: s.reddit,    blank: true },
  ].filter(Boolean);
  el.className = "contact-links";
  el.innerHTML = items.map(i =>
    `<a class="contact-link" href="${i.href}"${i.blank ? ' target="_blank" rel="noopener"' : ""}>${i.icon}<span>${i.label}</span></a>`
  ).join("");
}

/* --- Formatowanie daty (pl) ------------------------------------------- */
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  } catch { return iso; }
}

/* --- Karta projektu / wpisu ------------------------------------------- */
function projectCard(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
  const href = `${BASE}${p.url}`;
  const img = p.image ? `${BASE}${p.image}` : `${BASE}assets/img/placeholder.svg`;
  return `
    <article class="card">
      <a class="card__media" href="${href}">
        <img src="${img}" alt="${p.title}" loading="lazy">
        ${p.type ? `<span class="card__badge">${p.type}</span>` : ""}
      </a>
      <div class="card__body">
        <h3 class="card__title"><a href="${href}">${p.title}</a></h3>
        <p class="card__desc">${p.description}</p>
        <div class="tags">${tags}</div>
      </div>
    </article>`;
}

function postCard(p) {
  const href = `${BASE}${p.url}`;
  const img = p.image ? `${BASE}${p.image}` : `${BASE}assets/img/placeholder.svg`;
  return `
    <article class="card">
      <a class="card__media" href="${href}">
        <img src="${img}" alt="${p.title}" loading="lazy">
      </a>
      <div class="card__body">
        <div class="card__meta"><time datetime="${p.date}">${formatDate(p.date)}</time>${p.readtime ? ` · ${p.readtime}` : ""}</div>
        <h3 class="card__title" style="margin-top:.4em"><a href="${href}">${p.title}</a></h3>
        <p class="card__desc">${p.excerpt}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </article>`;
}

/* --- Ładowanie danych JSON -------------------------------------------- */
async function loadJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Nie udało się wczytać ${path}`);
  return res.json();
}

/* Portfolio z filtrami po kategoriach */
async function renderProjects(targetId, { limit = null, filters = false } = {}) {
  const el = document.getElementById(targetId);
  if (!el) return;
  let data;
  try { data = await loadJSON("assets/data/projects.json"); }
  catch (e) { el.innerHTML = `<p class="empty">${e.message}</p>`; return; }

  let items = [...data].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (limit) items = items.slice(0, limit);

  const draw = list => el.innerHTML = list.length
    ? list.map(projectCard).join("")
    : `<p class="empty">Wkrótce pojawią się tutaj pierwsze projekty. Zajrzyj niebawem!</p>`;

  if (filters) {
    const cats = ["Wszystkie", ...new Set(data.flatMap(p => p.tags || []))];
    const bar = document.getElementById("project-filters");
    if (bar) {
      bar.innerHTML = cats.map((c, i) =>
        `<button class="filter-btn${i === 0 ? " active" : ""}" data-cat="${c}">${c}</button>`).join("");
      bar.addEventListener("click", e => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        bar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        draw(cat === "Wszystkie" ? items : items.filter(p => (p.tags || []).includes(cat)));
      });
    }
  }
  draw(items);
}

async function renderPosts(targetId, { limit = null } = {}) {
  const el = document.getElementById(targetId);
  if (!el) return;
  let data;
  try { data = await loadJSON("assets/data/posts.json"); }
  catch (e) { el.innerHTML = `<p class="empty">${e.message}</p>`; return; }
  let items = [...data].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (limit) items = items.slice(0, limit);
  el.innerHTML = items.length
    ? items.map(postCard).join("")
    : `<p class="empty">Wkrótce pojawią się tutaj pierwsze wpisy. Zajrzyj niebawem!</p>`;
}

/* --- Inicjalizacja: uruchom po załadowaniu DOM ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const active = document.body.dataset.page || "";
  renderHeader(active);
  renderFooter();
  renderContact("contact-links");
});
