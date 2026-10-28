import { mountHeroMotion } from './hero-motion.js';
import { projects } from './portfolio-data.js';
import { cover } from './covers.js';
import { body, escape, meta, newTab, primaryAction, sourceAction } from './render-work.js';

const byId = (id) => projects.find(p => p.id === id);
document.querySelector('[data-year]').textContent = new Date().getFullYear();
mountHeroMotion();

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
    ? `<a class="dialog-media dialog-media-link" href="${p.original}" target="_blank" rel="noopener noreferrer"><img src="${p.detail}" alt="${escape(p.title)} screenshot" width="1600" height="1000" decoding="async" /><span>Full size <svg class="icon" aria-hidden="true"><use href="#i-out" /></svg>${newTab}</span></a>`
    : `<figure class="dialog-media dialog-cover">${cover(p)}<figcaption>A drawn motif of what ${escape(p.title)} does. There is no public screenshot yet.</figcaption></figure>`;
  content.innerHTML = `<h2 class="dialog-title" id="dialog-title" tabindex="-1">${escape(p.title)}</h2>
    <p class="dialog-meta">${body}${meta(p)}</p>
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
// Native modal dialogs let Tab leave for the browser's own toolbar; APG asks for it to wrap within the dialog.
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const stops = [...dialog.querySelectorAll('a[href], button')];
  const edge = event.shiftKey ? stops[0] : stops.at(-1);
  if (document.activeElement === edge || (event.shiftKey && document.activeElement === dialog.querySelector('.dialog-title'))) {
    event.preventDefault();
    (event.shiftKey ? stops.at(-1) : stops[0]).focus();
  }
});
// Backdrop clicks are caught at the document: a click listener on the dialog itself makes screen readers
// announce everything inside it as "clickable".
document.addEventListener('click', event => {
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
// Measured from each stage's anchor, which stays in flow while the stage itself is pinned.
const rail = document.querySelector('.launch-rail');
const railLinks = [...document.querySelectorAll('[data-rail]')];
const anchors = railLinks.map(link => document.getElementById(link.hash.slice(1)));
if (railLinks.length) {
  const mark = () => {
    const probe = innerHeight * 0.5;
    let current = 0;
    anchors.forEach((anchor, i) => {
      if (anchor.getBoundingClientRect().top <= probe) current = i;
    });
    rail.classList.toggle('is-idle', anchors[0].getBoundingClientRect().top > probe);
    railLinks.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', mark, { passive: true });
  addEventListener('resize', mark);
  mark();
}

// ---------- Keep the focused stage on top ----------
// Pinned stages stack, so a link in an earlier stage can sit under the next one (WCAG 2.4.11). When focus
// enters a stage that isn't the one fully in view, jump to that stage's own scroll position.
// Same condition as the pinned-stage media query in site.css.
const pinned = matchMedia('(min-width: 1280px) and (min-height: 700px) and (prefers-reduced-motion: no-preference), (min-width: 1024px) and (min-height: 840px) and (prefers-reduced-motion: no-preference)');
document.querySelector('.launch')?.addEventListener('focusin', event => {
  const stage = event.target.closest('.stage');
  // Keyboard focus only: a click can only land on the stage already in view.
  if (!pinned.matches || !stage || !event.target.matches(':focus-visible')) return;
  // The browser scrolls the focused link into view first; correct that scroll on the next frame.
  requestAnimationFrame(() => {
    const offset = stage.previousElementSibling.getBoundingClientRect().top;
    if (Math.abs(offset) > 1) scrollTo({ top: scrollY + offset, behavior: 'instant' });
  });
});

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

// ---------- Mobile menu: an APG disclosure ----------
// The button's name stays "Menu"; aria-expanded carries the state. Escape and moving focus out both close it.
const nav = document.querySelector('.main-nav');
const menu = nav.querySelector('.menu-toggle');
const navList = nav.querySelector('.main-nav-list');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navList.classList.toggle('is-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('focusout', event => {
  if (!nav.contains(event.relatedTarget)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    if (nav.contains(document.activeElement)) menu.focus();
  }
});
// One document listener closes the menu on a link choice or an outside click (a listener on the list would
// make NVDA call the list "clickable").
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') || event.target.closest('.main-nav-list a')) setMenu(false);
});
