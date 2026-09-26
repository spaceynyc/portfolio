import { mountHeroMotion } from './hero-motion.js';
import { mountCarousel } from './carousel.js';
import { projects, technologies } from './portfolio-data.js';
import { cover } from './covers.js';

const EMAIL = 'srich7x@gmail.com';
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}" /></svg>`;
const media = (p, loading = 'lazy') => p.image
  ? `<img src="${p.image}" alt="" width="960" height="540" loading="${loading}" decoding="async" draggable="false" />`
  : cover(p);
const byId = (id) => projects.find(p => p.id === id);

document.querySelector('#project-track').innerHTML = projects.map((p, i) => `
  <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${projects.length}">
    <button class="project-card" type="button" data-project="${p.id}" aria-haspopup="dialog" aria-label="${escape(p.title)}: ${escape(p.summary)}" aria-describedby="carousel-help" style="--project-color:${p.color}">
      <span class="card-media">${media(p, i < 3 ? 'eager' : 'lazy')}</span>
      <span class="card-body">
        <span class="card-title">${escape(p.title)}</span>
        <span class="card-summary">${escape(p.summary)}</span>
        <span class="card-tech">${p.tech.slice(0, 3).map(escape).join(' · ')}</span>
      </span>
      <span class="card-arrow" aria-hidden="true">${icon('arrow')}</span>
    </button>
  </div>`).join('');
document.querySelector('.technology-list').innerHTML = technologies.map(t => `<li>${escape(t)}</li>`).join('');
document.querySelector('[data-year]').textContent = new Date().getFullYear();
mountHeroMotion();
mountCarousel();

// The 3D service icons load only when their section approaches the viewport; posters show until then.
const servicesSection = document.querySelector('#services');
new IntersectionObserver((entries, observer) => {
  if (!entries[0].isIntersecting) return;
  observer.disconnect();
  import('./service-icons.js').then(module => module.mountServiceIcons());
}, { rootMargin: '100px 0px' }).observe(servicesSection);

const services = {
  agents: { title: 'AI agents', text: 'Intelligence with somewhere to go. I build agents that research, guide, and act, from a team of competing analytical voices to a shopping assistant that finds your next favorite thing.', tags: ['AI Agents', 'OpenAI', 'TypeScript', 'Python'], projects: ['socionics-research-lab', 'zipchair-ai-assistant', 'openclaw-ecosystem'] },
  interfaces: { title: 'Interfaces', text: 'Complex systems, clear interactions. I design and build tools that help people find their way, with considered details that make everyday work feel lighter.', tags: ['React', 'TypeScript', 'UI/UX', 'Tailwind'], projects: ['drift', 'zipchair-intel'] },
  automation: { title: 'Automation', text: 'More room for the work that matters. I connect screens, devices, and creative pipelines into workflows that take repetitive tasks off your hands and keep an idea moving.', tags: ['Python', 'FastAPI', 'OCR', 'Automation'], projects: ['sue', 'phoneagent', 'aeroeden'] },
  experiences: { title: 'Experiences', text: 'Digital spaces with a sense of wonder. I use sound, motion, and generative graphics to turn an abstract idea into a world you can step into and explore.', tags: ['Three.js', 'R3F', 'GLSL', 'Web Audio'], projects: ['socionics-galaxy', 'inner-system', 'shader-gallery'] },
};

const dialog = document.querySelector('#detail-dialog');
const content = document.querySelector('#dialog-content');
const back = dialog.querySelector('.dialog-back');
let opener = null;
let backTo = null;

const tags = (list) => `<ul class="tag-list" role="list">${list.map(t => `<li>${escape(t)}</li>`).join('')}</ul>`;
const projectRows = (ids) => `<ul class="project-list" role="list">${ids.map(id => {
  const p = byId(id);
  return `<li><button class="project-row" type="button" data-project="${p.id}" style="--project-color:${p.color}"><span class="row-media">${media(p)}</span><span><span class="row-title">${escape(p.title)}</span><span class="row-summary">${escape(p.summary)}</span></span>${icon('arrow')}</button></li>`;
}).join('')}</ul>`;

function show(markup, { hash = '', returnTo = null } = {}) {
  if (!dialog.open) opener = document.activeElement;
  backTo = returnTo;
  back.hidden = !returnTo;
  content.innerHTML = markup;
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add('no-scroll');
  }
  dialog.scrollTop = 0;
  history.replaceState(null, '', hash ? `#${hash}` : location.pathname + location.search);
  (returnTo ? back : dialog.querySelector('.dialog-close')).focus();
}

function projectActions(p) {
  const primary = p.link
    ? `<a class="pill" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${p.id === 'aeroeden' ? 'Visit AEROEDEN on X' : 'Open live project'} ${icon('out')}<span class="visually-hidden"> (opens in a new tab)</span></a>`
    : `<a class="pill" href="mailto:${EMAIL}?subject=${encodeURIComponent(`About ${p.title}`)}">Ask me about it ${icon('arrow')}</a>`;
  const source = p.github
    ? `<a class="text-button" href="${escape(p.github)}" target="_blank" rel="noopener noreferrer">${icon('github')} Source on GitHub<span class="visually-hidden"> (opens in a new tab)</span></a>`
    : '';
  return `<div class="dialog-actions">${primary}${source}</div>`;
}

function showProject(id, returnTo) {
  const p = byId(id);
  if (!p) return;
  const image = p.image
    ? `<a class="dialog-media dialog-media-link" href="${p.original}" target="_blank" rel="noopener"><img src="${p.detail}" alt="${escape(p.title)} screenshot" width="1600" height="1000" decoding="async" /><span>Full size ${icon('out')}</span></a>`
    : `<div class="dialog-media">${cover(p)}</div>`;
  show(`<h2 class="dialog-title" id="dialog-title">${escape(p.title)}</h2><p class="dialog-summary">${escape(p.summary)}</p>${projectActions(p)}${image}<p class="dialog-text">${escape(p.blurb)}</p>${tags(p.tech)}`, { hash: p.id, returnTo });
}

function showAllProjects() {
  show(`<h2 class="dialog-title" id="dialog-title">All projects</h2><p class="dialog-summary">${projects.length} projects across agents, interfaces, automation, and immersive worlds.</p>${projectRows(projects.map(p => p.id))}`, { hash: 'projects' });
}

function showService(key) {
  const s = services[key];
  if (!s) return;
  show(`<h2 class="dialog-title" id="dialog-title">${s.title}</h2><p class="dialog-text">${s.text}</p>${tags(s.tags)}<h3 class="dialog-subhead">Related projects</h3>${projectRows(s.projects)}<div class="dialog-actions"><a class="pill" href="mailto:${EMAIL}?subject=${encodeURIComponent(`${s.title} project`)}">Start a conversation ${icon('arrow')}</a></div>`, { hash: key });
}

dialog.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  history.replaceState(null, '', location.pathname + location.search);
  opener?.focus({ preventScroll: true });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
back.addEventListener('click', () => backTo?.());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});

let listContext = null;
document.addEventListener('click', event => {
  const project = event.target.closest('[data-project]');
  if (project) {
    const fromList = dialog.open && project.closest('.project-list') ? listContext : null;
    return showProject(project.dataset.project, fromList);
  }
  if (event.target.closest('[data-modal="work"]')) {
    listContext = showAllProjects;
    return showAllProjects();
  }
  const service = event.target.closest('[data-service]');
  if (service) {
    const key = service.dataset.service;
    listContext = () => showService(key);
    return showService(key);
  }
});

// Deep links: #<project-id>, #projects, or a service key reopen the matching dialog.
function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  if (id === 'projects') { listContext = showAllProjects; showAllProjects(); }
  else if (services[id]) { listContext = () => showService(id); showService(id); }
  else if (byId(id)) showProject(id);
}
openFromHash();
window.addEventListener('hashchange', openFromHash);

// Copy the email address for visitors without a mail app.
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyStatus.textContent = 'Copied';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.contact-email'));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    copyStatus.textContent = 'Selected, press Ctrl+C or ⌘C';
  }
  clearTimeout(copyButton.timer);
  copyButton.timer = setTimeout(() => { copyStatus.textContent = ''; }, 4000);
});

// Mobile menu.
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('is-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
