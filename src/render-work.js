// Static markup for the launch stages and the belt, rendered from portfolio-data.js at build time
// (see vite.config.js) so the work reads without JavaScript. Pure string functions: no DOM access.
import { projects } from './portfolio-data.js';
import { cover } from './covers.js';

export const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}" /></svg>`;
const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';

const featured = ['socionics-galaxy', 'socionics-research-lab', 'zipchair-ai-assistant'].map(id => projects.find(p => p.id === id));
const belt = projects.filter(p => !p.featured);

export const meta = (p) => [p.kind, ...p.status].map(escape).join('<span aria-hidden="true"> · </span>');

export function primaryAction(p) {
  if (!p.link) return `<a class="pill" href="mailto:srich7x@gmail.com?subject=${encodeURIComponent(`About ${p.title}`)}">Ask me about it ${icon('arrow')}</a>`;
  const label = p.id === 'aeroeden' ? 'Visit AEROEDEN on X' : p.status.includes('Live demo') ? 'Open the demo' : 'Open live project';
  return `<a class="pill" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${label} ${icon('out')}${newTab}</a>`;
}

export function sourceAction(p) {
  return p.github
    ? `<a class="text-link" href="${escape(p.github)}" target="_blank" rel="noopener noreferrer">${icon('github')} Code on GitHub${newTab}</a>`
    : '';
}

export function railMarkup() {
  return `<nav class="launch-rail" aria-label="Featured projects"><ol class="rail-track" role="list">${featured.map((p, i) => `
    <li><a href="#${p.id}" data-rail="${i}" style="--project-color:${p.color}"><span class="rail-body" aria-hidden="true"></span><span class="rail-label">${escape(p.title)}</span></a></li>`).join('')}
  </ol></nav>`;
}

export function stagesMarkup() {
  return featured.map((p, i) => `
    <span class="stage-anchor" id="${p.id}"></span>
    <article class="stage stage-${i + 1}" aria-labelledby="stage-title-${p.id}" style="--project-color:${p.color}">
      <div class="stage-inner">
        <figure class="stage-media">
          <img src="${p.detail}" alt="${escape(p.alt)}" width="1600" height="1000" loading="${i ? 'lazy' : 'eager'}" decoding="async" />
        </figure>
        <div class="stage-copy">
          <h3 class="stage-title" id="stage-title-${p.id}">${escape(p.title)}</h3>
          <p class="stage-meta">${meta(p)}</p>
          <p class="stage-lede">${escape(p.summary)}</p>
          <p class="stage-story">${escape(p.story)}</p>
          <p class="stage-stack">Built with ${p.tech.filter(t => t !== 'Socionics').map(escape).join(', ')}</p>
          <div class="stage-actions">${primaryAction(p)}${sourceAction(p)}</div>
        </div>
      </div>
    </article>`).join('');
}

const groups = [
  { key: 'agents', title: 'Agents that see and act' },
  { key: 'worlds', title: 'Worlds and tools' },
];

export function beltMarkup() {
  return groups.map(g => `
    <div class="belt-group">
      <h3 class="belt-heading">${g.title}</h3>
      <ul class="belt-list" role="list">${belt.filter(p => p.group === g.key).map(p => `
        <li><a class="belt-item" href="#${p.id}" aria-haspopup="dialog" style="--project-color:${p.color}">
          <span class="belt-thumb">${p.image ? `<img src="${p.image}" alt="" width="960" height="540" loading="lazy" decoding="async" />` : cover(p)}</span>
          <span class="belt-text">
            <span class="belt-name">${escape(p.title)}</span>
            <span class="belt-summary">${escape(p.summary)}</span>
            <span class="belt-meta">${meta(p)}</span>
          </span>
          ${icon('arrow')}
        </a></li>`).join('')}
      </ul>
    </div>`).join('');
}

// The about paragraph's counts, derived from the data so they never drift.
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const say = (n) => words[n] ?? String(n);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
export function countsSentence() {
  const live = projects.filter(p => p.status.some(s => s === 'Live' || s === 'Live demo')).length;
  const code = projects.filter(p => p.github).length;
  return `${cap(say(projects.length))} projects so far. ${cap(say(live))} run live on the web, and ${say(code)} have their code on GitHub.`;
}

export const beltCount = cap(say(belt.length));
