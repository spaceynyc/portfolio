// Scroll-snap carousel. The cards form one Tab stop (roving tabindex); arrow keys, Home and End move between them.
export function mountCarousel() {
  const track = document.querySelector('#project-track');
  const slides = [...track.children];
  const cards = slides.map(slide => slide.querySelector('.project-card'));
  const previous = document.querySelector('[data-carousel="previous"]');
  const next = document.querySelector('[data-carousel="next"]');
  const dots = document.querySelector('.carousel-dots');
  const status = document.querySelector('#carousel-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pad = (n) => String(n).padStart(2, '0');
  let perPage = 3, starts = [], index = 0, active = 0, scheduled = false;

  const offset = (i) => slides[i].offsetLeft - slides[0].offsetLeft;
  const behavior = () => (motion.matches ? 'instant' : 'smooth');

  function setActive(i) {
    active = Math.max(0, Math.min(i, cards.length - 1));
    cards.forEach((card, n) => { card.tabIndex = n === active ? 0 : -1; });
  }

  function update() {
    scheduled = false;
    const step = slides.length > 1 ? offset(1) : 1;
    index = Math.min(slides.length - perPage, Math.max(0, Math.round(track.scrollLeft / step)));
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const page = starts.reduce((best, start, i) => (Math.abs(start - index) < Math.abs(starts[best] - index) ? i : best), 0);
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === page)));
    const last = Math.min(index + perPage, slides.length);
    status.textContent = perPage === 1 ? `${pad(index + 1)} / ${slides.length}` : `${pad(index + 1)}–${pad(last)} / ${slides.length}`;
    // Keep the Tab stop on a visible card.
    if (!track.contains(document.activeElement) && (active < index || active >= last)) setActive(index);
  }

  function go(i) {
    track.scrollTo({ left: offset(Math.max(0, Math.min(i, slides.length - perPage))), behavior: behavior() });
  }

  function move(direction) {
    const target = direction > 0 ? starts.find(start => start > index) : starts.findLast(start => start < index);
    go(target ?? (direction > 0 ? slides.length - perPage : 0));
  }

  function focusCard(i) {
    setActive(i);
    const card = cards[active];
    card.focus({ preventScroll: true });
    if (active < index) go(active);
    else if (active >= index + perPage) go(active - perPage + 1);
  }

  function resize() {
    perPage = Number(getComputedStyle(track).getPropertyValue('--visible')) || 3;
    starts = [...new Set(Array.from({ length: Math.ceil(slides.length / perPage) }, (_, i) => Math.min(i * perPage, slides.length - perPage)))];
    dots.replaceChildren(...starts.map((start) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show projects ${start + 1} to ${Math.min(start + perPage, slides.length)}`);
      dot.setAttribute('aria-controls', 'project-track');
      dot.addEventListener('click', () => go(start));
      return dot;
    }));
    update();
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  track.addEventListener('focusin', (event) => {
    const i = cards.indexOf(event.target);
    if (i >= 0) setActive(i);
  });
  track.addEventListener('keydown', (event) => {
    const keys = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    focusCard(keys[event.key]);
  });

  setActive(0);
  new ResizeObserver(resize).observe(track);
  resize();
}
