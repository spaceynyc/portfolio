// Static markup for the launch stages and the belt, rendered from portfolio-data.js at build time
// (see vite.config.js) so the work reads without JavaScript. Pure string functions: no DOM access.
import { projects } from './portfolio-data.js';
import { cover } from './covers.js';

export const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}" /></svg>`;
export const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';
// The project's lit sphere (components.css), placed before its name or metadata.
export const body = '<span class="project-body" aria-hidden="true"></span>';

const featured = ['socionics-galaxy', 'socionics-research-lab', 'pitchandplank', 'zipchair-ai-assistant'].map(id => projects.find(p => p.id === id));
const belt = projects.filter(p => !p.featured);

// Each status carries its own dot and never breaks inside, so a wrapped line never ends on a dangling "·".
// Screen readers get a hidden comma instead of the dot; without it the parts run together.
export const meta = (p) => [`<span>${escape(p.kind)}</span>`, ...p.status.map(s => `<span class="meta-part"><span class="visually-hidden">, </span><span class="meta-sep" aria-hidden="true">·</span>${escape(s)}</span>`)].join(' ');

// Outside the dialog, the stages carry the same action labels; `named` adds the project's name for screen
// readers, so tabbing from stage to stage says which project each link belongs to.
const forProject = (p, named) => (named ? `<span class="visually-hidden">, ${escape(p.title)}</span>` : '');

export function primaryAction(p, named = false) {
  if (!p.link) return `<a class="pill" href="mailto:srich7x@gmail.com?subject=${encodeURIComponent(`About ${p.title}`)}">Ask me about it${forProject(p, named)} ${icon('arrow')}</a>`;
  const label = p.id === 'aeroeden' ? 'Visit AEROEDEN on X' : p.status.includes('Live demo') ? 'Open the demo' : 'Open live project';
  return `<a class="pill" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${label}${forProject(p, named)} ${icon('out')}${newTab}</a>`;
}

export function sourceAction(p, named = false) {
  return p.github
    ? `<a class="text-link" href="${escape(p.github)}" target="_blank" rel="noopener noreferrer">${icon('github')} Code on GitHub${forProject(p, named)}${newTab}</a>`
    : '';
}

export function railMarkup() {
  return `<nav class="launch-rail" aria-label="Featured projects"><ol class="rail-track" role="list">${featured.map((p, i) => `
    <li><a href="#${p.id}" data-rail="${i}" style="--project-color:${p.color}"><span class="project-body rail-body" aria-hidden="true"></span><span class="rail-label">${escape(p.title)}</span></a></li>`).join('')}
  </ol></nav>`;
}

export function stagesMarkup() {
  return featured.map((p, i) => `
    <span class="stage-anchor" id="${p.id}"></span>
    <article class="stage stage-${i + 1}" aria-labelledby="stage-title-${p.id}" style="--project-color:${p.color}">
      <div class="stage-inner">
        <figure class="stage-media" style="${p.frame ?? ''}">
          <img src="${p.stage ?? p.detail}" alt="${escape(p.alt)}" width="1600" height="1000" loading="${i ? 'lazy' : 'eager'}" decoding="async" />
        </figure>
        <div class="stage-copy">
          <h3 class="stage-title" id="stage-title-${p.id}">${escape(p.title).replace(' AI', '\u00a0AI')}</h3>
          <p class="stage-meta">${body}${meta(p)}</p>
          <p class="stage-lede">${escape(p.summary)}</p>
          <p class="stage-story">${escape(p.story)}</p>
          <p class="stage-stack">Built with ${p.tech.filter(t => t !== 'Socionics').map(escape).join(', ')}</p>
          <div class="stage-actions">${primaryAction(p, true)}${sourceAction(p, true)}</div>
        </div>
      </div>
    </article>`).join('');
}

const groups = [
  { key: 'agents', title: 'Agents that see and act' },
  { key: 'worlds', title: 'Worlds and tools' },
];

// Each row is a block link: the link sits on the project name only, so its name stays short, and its
// ::after stretches over the whole row so the row is still one big target (see .row-link in components.css).
export function beltMarkup() {
  return groups.map(g => `
    <div class="belt-group">
      <h3 class="belt-heading">${g.title}</h3>
      <ul class="belt-list" role="list">${belt.filter(p => p.group === g.key).map(p => `
        <li class="belt-item row-link" style="--project-color:${p.color}">
          <span class="belt-thumb">${p.image ? `<img src="${p.image}" alt="" width="960" height="540" loading="lazy" decoding="async" />` : cover(p)}</span>
          <div class="belt-text">
            <h4 class="belt-name">${body}<a href="#${p.id}" aria-haspopup="dialog">${escape(p.title)}</a></h4>
            <p class="belt-summary">${escape(p.summary)}</p>
            <p class="belt-meta">${meta(p)}</p>
          </div>
          ${icon('arrow')}
        </li>`).join('')}
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
