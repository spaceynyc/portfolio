export function mountHeroMotion() {
  const shell = document.querySelector(".site-shell");
  const heroArt = document.querySelector(".hero-art");
  const ring = document.createElement("div");
  ring.className = "hero-art hero-ring-glow";
  ring.setAttribute("aria-hidden", "true");
  const cubes = document.createElement("div");
  cubes.className = "hero-art hero-cube-glow";
  cubes.setAttribute("aria-hidden", "true");
  heroArt.after(ring, cubes);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const hoverDevice = matchMedia("(hover: hover)");
  let active = false,
    amount = 0,
    frame = 0,
    last = 0,
    phase = 0;

  // Hit regions cover cube silhouettes, leaving text, buttons and empty space inert.
  const polygons = [
    [
      [978, 120],
      [1134, 12],
      [1232, 57],
      [1283, 197],
      [1212, 275],
      [1042, 283],
    ],
    [
      [1005, 317],
      [1093, 239],
      [1249, 289],
      [1300, 375],
      [1259, 467],
      [1021, 467],
    ],
    [
      [816, 200],
      [875, 141],
      [958, 167],
      [1013, 246],
      [1070, 333],
      [992, 426],
      [861, 367],
    ],
    [
      [1252, 101],
      [1338, 88],
      [1390, 183],
      [1450, 291],
      [1386, 403],
      [1270, 394],
      [1201, 251],
    ],
  ];
  function inside(x, y, points) {
    let hit = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i],
        [xj, yj] = points[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
        hit = !hit;
    }
    return hit;
  }
  function tick(time) {
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
    last = time;
    amount += ((active ? 1 : 0) - amount) * (1 - Math.exp(-dt * 6));
    if (active) phase += dt;
    const lift = motion.matches
      ? 0
      : amount * (4 + Math.sin(phase * 1.6) * 1.6);
    shell.style.setProperty("--cube-lift", `${-lift}px`);
    shell.style.setProperty(
      "--cube-tilt",
      `${motion.matches ? 0 : amount * Math.sin(phase * 0.8) * 0.16}deg`,
    );
    shell.style.setProperty("--cube-light", String(amount * 0.5));
    shell.dataset.cubesHovered = String(active);
    if (active || amount > 0.002) frame = requestAnimationFrame(tick);
    else {
      frame = 0;
      last = 0;
      shell.style.setProperty("--cube-lift", "0px");
      shell.style.setProperty("--cube-tilt", "0deg");
      shell.style.setProperty("--cube-light", "0");
    }
  }
  function setActive(value) {
    active = value;
    if (!frame) frame = requestAnimationFrame(tick);
  }
  shell.addEventListener("pointermove", (event) => {
    if (!hoverDevice.matches || event.pointerType === "touch") return;
    const rect = shell.getBoundingClientRect();
    if (innerWidth <= 900) {
      const art = heroArt.getBoundingClientRect();
      setActive(
        event.clientX > Math.max(art.left + 80, rect.left) &&
          event.clientX < art.right - 100 &&
          event.clientY > art.top + 40 &&
          event.clientY < art.bottom - 50,
      );
    } else {
      const scale = rect.width / 1672;
      const x = (event.clientX - rect.left) / scale,
        y = (event.clientY - rect.top) / scale;
      setActive(polygons.some((points) => inside(x, y, points)));
    }
  });
  shell.addEventListener("pointerleave", () => setActive(false));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) setActive(false);
  });
}
