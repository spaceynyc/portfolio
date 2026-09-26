// Hovering a cube lifts the sculpture and lights the cubes. Hit regions follow the cube silhouettes,
// expressed in the 932×467 space of the hero image (offset by the 740px it sat at in the original artwork).
const polygons = [
  [[978, 120], [1134, 12], [1232, 57], [1283, 197], [1212, 275], [1042, 283]],
  [[1005, 317], [1093, 239], [1249, 289], [1300, 375], [1259, 467], [1021, 467]],
  [[816, 200], [875, 141], [958, 167], [1013, 246], [1070, 333], [992, 426], [861, 367]],
  [[1252, 101], [1338, 88], [1390, 183], [1450, 291], [1386, 403], [1270, 394], [1201, 251]],
];

function inside(x, y, points) {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export function mountHeroMotion() {
  const shell = document.querySelector('.site-shell');
  const heroArt = document.querySelector('.hero-art');
  const layers = ['hero-ring-glow', 'hero-cube-glow'].map((name) => {
    const layer = document.createElement('div');
    layer.className = `hero-art ${name}`;
    return layer;
  });
  heroArt.after(...layers);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverDevice = matchMedia('(hover: hover)');
  let active = false, amount = 0, frame = 0, last = 0, phase = 0;

  function apply(lift, tilt, light) {
    shell.style.setProperty('--cube-lift', `${-lift}px`);
    shell.style.setProperty('--cube-tilt', `${tilt}deg`);
    shell.style.setProperty('--cube-light', String(light));
  }

  function tick(time) {
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
    last = time;
    amount += ((active ? 1 : 0) - amount) * (1 - Math.exp(-dt * 6));
    if (active) phase += dt;
    apply(amount * (4 + Math.sin(phase * 1.6) * 1.6), amount * Math.sin(phase * 0.8) * 0.16, amount * 0.5);
    if (active || amount > 0.002) frame = requestAnimationFrame(tick);
    else {
      frame = 0;
      last = 0;
      apply(0, 0, 0);
    }
  }

  function setActive(value) {
    if (value === active) return;
    active = value;
    shell.dataset.cubesHovered = String(active);
    // Reduced motion: no lift or sway, just switch the glow on and off.
    if (motion.matches) return apply(0, 0, active ? 0.5 : 0);
    if (!frame) frame = requestAnimationFrame(tick);
  }

  shell.addEventListener('pointermove', (event) => {
    if (!hoverDevice.matches || event.pointerType === 'touch') return;
    const art = heroArt.getBoundingClientRect();
    if (!art.width) return;
    const x = ((event.clientX - art.left) / art.width) * 932 + 740;
    const y = ((event.clientY - art.top) / art.height) * 467;
    setActive(polygons.some((points) => inside(x, y, points)));
  });
  shell.addEventListener('pointerleave', () => setActive(false));
  window.addEventListener('resize', () => setActive(false));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setActive(false);
  });
}
