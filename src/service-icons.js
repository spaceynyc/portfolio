import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function studioEnvironment(renderer) {
  const studio = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials = [];
  function panel(color, intensity, position, size) {
    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    });
    material.color.multiplyScalar(intensity);
    materials.push(material);
    const light = new THREE.Mesh(geometry, material);
    light.position.set(...position);
    light.scale.set(...size, 1);
    light.lookAt(0, 0, 0);
    studio.add(light);
  }
  panel(0xf0f4ff, 3, [-4, 2, 4], [3, 7]);
  panel(0xe7edff, 2.8, [0, 0.1, 5], [3.6, 3.6]);
  panel(0x779aff, 4, [4, 0, 3], [1, 6]);
  panel(0xe4b5ff, 3, [0, -3, 3], [6, 1]);
  panel(0xffffff, 4, [0, 5, 1], [5, 3]);
  panel(0x9bdfff, 2, [-1, 0, -5], [3, 6]);
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(studio, 0.025, 0.1, 100);
  generator.dispose();
  geometry.dispose();
  materials.forEach((material) => material.dispose());
  return environment;
}

async function mountIcon(button) {
  const holder = button.querySelector(".service-art");
  const name = button.dataset.service;
  const model = (await new GLTFLoader().loadAsync(`/assets/${name}-icon.glb`))
    .scene;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene();
  const environment = studioEnvironment(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1;
  scene.add(model);
  // Blender exports glTF with Y up. Match the icon's Blender camera exactly.
  const halfSize = 1.25;
  const camera = new THREE.OrthographicCamera(
    -halfSize,
    halfSize,
    halfSize,
    -halfSize,
    0.1,
    50,
  );
  camera.position.set(0, 1.2, 8);
  camera.lookAt(0, 0, 0);
  holder.append(renderer.domElement);
  holder.classList.add("is-modeled");
  holder.dataset.model = "blender";
  holder.dataset.rotating = "false";
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0,
    last = 0,
    visible = true,
    hovered = false;

  function render() {
    renderer.render(scene, camera);
    holder.dataset.rotation = model.rotation.y.toFixed(5);
  }
  function resize() {
    const width = holder.clientWidth,
      height = holder.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -halfSize * aspect;
    camera.right = halfSize * aspect;
    camera.updateProjectionMatrix();
    render();
  }
  function tick(time) {
    if (!hovered || !visible || motion.matches) return stop();
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
    last = time;
    model.rotation.y += dt * 0.36; // One revolution every 17.5 seconds.
    render();
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (frame || !visible || motion.matches) return;
    last = 0;
    holder.dataset.rotating = "true";
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    holder.dataset.rotating = "false";
  }
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    hovered = true;
    start();
  });
  button.addEventListener("pointerleave", () => {
    hovered = false;
    stop();
  });
  button.addEventListener("click", () => {
    hovered = false;
    stop();
  });
  motion.addEventListener("change", () => {
    if (motion.matches) stop();
    else if (hovered) start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (hovered) start();
  });
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (!visible) stop();
    else if (hovered) start();
  });
  observer.observe(holder);
  new ResizeObserver(resize).observe(holder);
  resize();
}

export async function mountServiceIcons() {
  // A failed WebGL context retains the rendered Blender poster as a fallback.
  return Promise.allSettled(
    [...document.querySelectorAll(".service")].map(mountIcon),
  );
}
