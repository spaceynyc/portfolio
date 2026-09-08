import { applyLettering } from './lettering.js';
import { mountHeroMotion } from './hero-motion.js';
import { mountCarousel } from './carousel.js';
import { projects, technologies } from './portfolio-data.js';

applyLettering();

const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>';
const tags = (list) => `<div class="detail-tags">${list.map(t => `<span>${escape(t)}</span>`).join('')}</div>`;
const thumbnail = (project, loading = 'lazy') => project.image
  ? `<img src="${escape(project.image)}" alt="${escape(project.title)} screenshot" loading="${loading}" decoding="async" draggable="false" width="1440" height="900" />`
  : `<div class="portfolio-pattern" style="--project-color:${project.color}" aria-hidden="true"><span>${project.number}</span><svg viewBox="0 0 160 110"><ellipse cx="80" cy="55" rx="58" ry="22" transform="rotate(-28 80 55)"/><ellipse cx="80" cy="55" rx="58" ry="22" transform="rotate(28 80 55)"/><path d="M80 32 88 48 106 55 88 62 80 78 72 62 54 55 72 48Z"/></svg><small>${escape(project.tech[0])} / ${escape(project.tech.at(-1))}</small></div>`;

document.querySelector('#project-track').innerHTML = projects.map((p, i) => `
  <article class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${projects.length}: ${escape(p.title)}">
    <button class="portfolio-card" data-project="${p.id}" aria-label="Explore ${escape(p.title)}" style="--project-color:${p.color}">
      <span class="portfolio-thumbnail">${thumbnail(p, i < 3 ? 'eager' : 'lazy')}<span class="portfolio-number">${p.number}${p.featured ? ' / FEATURED' : ''}</span></span>
      <span class="portfolio-caption"><span class="portfolio-title">${escape(p.title)}</span><span class="portfolio-tech">${p.tech.slice(0, 3).map(escape).join(' · ')}</span></span>
      <span class="round-arrow">${arrow}</span>
    </button>
  </article>`).join('');
document.querySelector('.technology-list').innerHTML = technologies.map(t => `<span>${escape(t)}</span>`).join('');
document.querySelector('[data-year]').textContent = new Date().getFullYear();
mountHeroMotion();
mountCarousel();
void import('./service-icons.js').then(module => module.mountServiceIcons());

const services = {
  brand: { title: 'AI agents', text: 'Intelligence with somewhere to go. I build agents that research, guide, and act — from a team of competing analytical voices to a shopping assistant that finds your next favorite thing.', tags: ['AI Agents', 'OpenAI', 'TypeScript', 'Python'], projects: ['socionics-research-lab', 'zipchair-ai-assistant', 'openclaw-ecosystem'] },
  digital: { title: 'Interfaces', text: 'Complex systems, clear interactions. I design and build tools that help people find their way, with considered details that make everyday work feel lighter.', tags: ['React', 'TypeScript', 'UI/UX', 'Tailwind'], projects: ['drift', 'zipchair-intel'] },
  content: { title: 'Automation', text: 'More room for the work that matters. I connect screens, devices, and creative pipelines into workflows that take repetitive tasks off your hands and keep an idea moving.', tags: ['Python', 'FastAPI', 'OCR', 'Automation'], projects: ['sue', 'phoneagent', 'aeroeden'] },
  experience: { title: 'Experiences', text: 'Digital spaces with a sense of wonder. I use sound, motion, and generative graphics to turn an abstract idea into a world you can step into and explore.', tags: ['Three.js', 'R3F', 'GLSL', 'Web Audio'], projects: ['socionics-galaxy', 'inner-system', 'shader-gallery'] },
};

const dialog = document.querySelector('#detail-dialog');
const content = document.querySelector('#dialog-content');
let lastFocus = null;
function show(markup) {
  if (!dialog.open) lastFocus = document.activeElement;
  content.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('no-scroll');
  dialog.scrollTop = 0;
  document.querySelector('.dialog-close').focus();
}
dialog.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  lastFocus?.focus({ preventScroll: true });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
function projectLinks(p) {
  return `<div class="project-links">${p.link ? `<a class="dialog-action" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${p.id === 'aeroeden' ? 'Explore AEROEDEN' : 'Launch live'} ↗</a>` : `<a class="dialog-action" href="mailto:srich7x@gmail.com?subject=${encodeURIComponent(`Tell me about ${p.title}`)}">Ask about this project ↗</a>`}${p.github ? `<a class="source-icon" href="${escape(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escape(p.title)} source on GitHub" title="View source on GitHub"><svg viewBox="0 0 24 24"><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-2-.5-2.7 3.2-.4 6.5-1.6 6.5-7.1a5.5 5.5 0 0 0-1.5-3.8 5.2 5.2 0 0 0-.2-3.7S18.1.3 15 2.1a13.3 13.3 0 0 0-7 0C4.9.3 3.7.7 3.7.7a5.2 5.2 0 0 0-.2 3.7A5.5 5.5 0 0 0 2 8.2c0 5.5 3.3 6.7 6.5 7.1C8 16 8 17 8 18v4" /></svg></a>` : ''}</div>`;
}
function showProject(id) {
  const p = projects.find(project => project.id === id);
  if (!p) return;
  show(`<p class="dialog-eyebrow">SELECTED WORK / ${p.number}</p><h2 class="dialog-title" id="dialog-title">${escape(p.title)}</h2><div class="portfolio-detail-image">${p.image ? `<a href="${p.image}" target="_blank" rel="noopener" aria-label="Open full-size ${escape(p.title)} screenshot">${thumbnail(p, 'eager')}<span>VIEW FULL SIZE ↗</span></a>` : thumbnail(p)}</div><p class="dialog-text">${escape(p.blurb)}</p>${tags(p.tech)}${projectLinks(p)}`);
}
function showAllProjects() {
  show(`<p class="dialog-eyebrow">11 PROJECTS / ONE RESTLESS CURIOSITY</p><h2 class="dialog-title" id="dialog-title">Ideas that made<br />it into the world.</h2><div class="project-directory">${projects.map(p => `<button data-project="${p.id}" style="--project-color:${p.color}"><span class="directory-image">${thumbnail(p)}</span><span><strong>${escape(p.title)}</strong><small>${p.tech.map(escape).join(' · ')}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`);
}
document.addEventListener('click', event => {
  const project = event.target.closest('[data-project]');
  if (project) return showProject(project.dataset.project);
  if (event.target.closest('[data-modal="work"]')) return showAllProjects();
  const service = event.target.closest('[data-service]');
  if (service) {
    const s = services[service.dataset.service];
    show(`<p class="dialog-eyebrow">WHAT I DO</p><h2 class="dialog-title" id="dialog-title">${s.title}</h2><p class="dialog-text">${s.text}</p>${tags(s.tags)}<p class="dialog-eyebrow related-heading">EXPLORE THE WORK</p><div class="related-projects">${s.projects.map(id => `<button data-project="${id}">${escape(projects.find(p => p.id === id).title)} ↗</button>`).join('')}</div><a class="dialog-action" href="mailto:srich7x@gmail.com">Let’s build something ↗</a>`);
  }
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
