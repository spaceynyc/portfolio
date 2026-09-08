export function mountCarousel() {
  const track = document.querySelector('#project-track');
  const slides = [...track.children];
  const previous = document.querySelector('[data-carousel="previous"]');
  const next = document.querySelector('[data-carousel="next"]');
  const dots = document.querySelector('.carousel-dots');
  const status = document.querySelector('#carousel-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let perPage = 3, starts = [], index = 0, scheduled = false;
  const position = (i) => slides[i].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  function update() {
    scheduled = false;
    index = Math.min(slides.length - perPage, Math.max(0, Math.round(track.scrollLeft / (position(1) - position(0)))));
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const page = starts.reduce((best, start, i) => Math.abs(start - index) < Math.abs(starts[best] - index) ? i : best, 0);
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === page)));
    status.textContent = `${String(index + 1).padStart(2, '0')}–${String(Math.min(index + perPage, slides.length)).padStart(2, '0')} / ${slides.length}`;
  }
  function go(i) {
    track.scrollTo({ left: position(Math.max(0, Math.min(i, slides.length - perPage))), behavior: motion.matches ? 'instant' : 'smooth' });
  }
  function move(direction) {
    const target = direction > 0 ? starts.find(start => start > index) : starts.findLast(start => start < index);
    go(target ?? (direction > 0 ? slides.length - perPage : 0));
  }
  function resize() {
    perPage = Number(getComputedStyle(track).getPropertyValue('--visible-projects')) || 3;
    starts = [...new Set(Array.from({ length: Math.ceil(slides.length / perPage) }, (_, i) => Math.min(i * perPage, slides.length - perPage)))];
    dots.replaceChildren(...starts.map((start, i) => {
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
  track.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(slides.length - perPage);
    else move(event.key === 'ArrowRight' ? 1 : -1);
    // Keep focus on the viewport when keyboard navigation scrolls a card out of view.
    track.focus({ preventScroll: true });
  });
  new ResizeObserver(resize).observe(track);
  resize();
}
