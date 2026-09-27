import { projects } from './portfolio-data.js';
import { cover } from './covers.js';
import { escape, meta, primaryAction, sourceAction } from './render-work.js';

const byId = (id) => projects.find(p => p.id === id);
document.querySelector('[data-year]').textContent = new Date().getFullYear();

// ---------- Project dialog ----------
// Belt links are ordinary #hash links, so opening a project adds a history entry and Back closes it.
// Featured projects have their own launch stage; their hashes scroll there instead of opening a dialog.
const dialog = document.querySelector('#detail-dialog');
const content = document.querySelector('#dialog-content');
let opener = null;
let openedByNavigation = false;

function showProject(p) {
  if (!dialog.open) opener = document.activeElement;
  content.style.setProperty('--project-color', p.color);
  const image = p.image
    ? `<a class="dialog-media dialog-media-link" href="${p.original}" target="_blank" rel="noopener"><img src="${p.detail}" alt="${escape(p.title)} screenshot" width="1600" height="1000" decoding="async" /><span>Full size <svg class="icon" aria-hidden="true"><use href="#i-out" /></svg></span></a>`
    : `<div class="dialog-media">${cover(p)}</div>`;
  content.innerHTML = `<h2 class="dialog-title" id="dialog-title" tabindex="-1">${escape(p.title)}</h2>
    <p class="dialog-meta">${meta(p)}</p>
    <p class="dialog-summary">${escape(p.summary)}</p>
    <div class="dialog-actions">${primaryAction(p)}${sourceAction(p)}</div>
    ${image}
    <p class="dialog-text">${escape(p.blurb)}</p>
    <p class="dialog-stack">Built with ${p.tech.map(escape).join(', ')}</p>`;
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add('no-scroll');
  }
  dialog.scrollTop = 0;
  dialog.querySelector('.dialog-title').focus();
}

function closeDialog() {
  if (!dialog.open) return;
  // Undo the history entry the link click added; the resulting hashchange closes the dialog.
  if (openedByNavigation) history.back();
  else dialog.close();
}

dialog.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  if (byId(location.hash.slice(1)) && !byId(location.hash.slice(1)).featured) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  openedByNavigation = false;
  opener?.focus({ preventScroll: true });
});
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDialog();
});
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog();
});

// Old share links from the previous layout (#projects, service keys) land on the matching part of the page.
const aliases = { projects: 'more', agents: 'more', interfaces: 'more', automation: 'more', experiences: 'about', services: 'about' };

function route(fromNavigation) {
  const id = decodeURIComponent(location.hash.slice(1));
  const p = byId(id);
  if (p && !p.featured) {
    openedByNavigation = fromNavigation;
    return showProject(p);
  }
  if (dialog.open) {
    openedByNavigation = false;
    dialog.close();
  }
  if (aliases[id]) document.getElementById(aliases[id])?.scrollIntoView();
}
route(false);
window.addEventListener('hashchange', () => route(true));
// A link to the hash that is already current fires no hashchange; open it directly.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.getAttribute('href') !== location.hash) return;
  const p = byId(location.hash.slice(1));
  if (p && !p.featured && !dialog.open) {
    event.preventDefault();
    openedByNavigation = false;
    showProject(p);
  }
});

// ---------- Launch rail: marks the featured stage in view ----------
const railLinks = [...document.querySelectorAll('[data-rail]')];
const stages = [...document.querySelectorAll('.stage')];
if (railLinks.length) {
  const mark = () => {
    const probe = innerHeight * 0.5;
    let current = 0;
    stages.forEach((stage, i) => {
      if (document.getElementById(railLinks[i].hash.slice(1)).getBoundingClientRect().top <= probe) current = i;
    });
    railLinks.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', mark, { passive: true });
  addEventListener('resize', mark);
  mark();
}

// ---------- Copy the email address for visitors without a mail app ----------
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

// ---------- Mobile menu ----------
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
