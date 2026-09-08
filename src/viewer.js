import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export async function mountViewer(container, url) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();
  room.dispose();
  const loader = new GLTFLoader();
  let gltf;
  try {
    gltf = await loader.loadAsync(url);
  } catch (err) {
    env.dispose();
    renderer.dispose();
    throw err;
  }
  if (!container.isConnected) {
    env.dispose();
    renderer.dispose();
    return () => {};
  }
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model),
    center = bounds.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const dimensions = bounds.getSize(new THREE.Vector3());
  const size = dimensions.length();
  scene.add(model);
  const fit = Math.max(
    dimensions.y,
    dimensions.x / camera.aspect,
    dimensions.z * 0.7,
  );
  const distance =
    (fit / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)))) * 1.25;
  camera.position.set(0.5, 0.45, 1).normalize().multiplyScalar(distance);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = distance * 0.65;
  controls.maxDistance = distance * 2;
  controls.autoRotate = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotateSpeed = 0.6;
  container.querySelector(".viewer-poster")?.remove();
  container.prepend(renderer.domElement);
  container.querySelector(".viewer-hint").textContent =
    "DRAG TO EXPLORE · SCROLL TO ZOOM";
  renderer.domElement.setAttribute(
    "aria-label",
    "Drag to rotate the 3D sculpture",
  );
  renderer.domElement.setAttribute("role", "img");
  const resize = new ResizeObserver(() => {
    if (container.clientWidth) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  resize.observe(container);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
  return () => {
    renderer.setAnimationLoop(null);
    resize.disconnect();
    controls.dispose();
    model.traverse((o) => {
      o.geometry?.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
          m.dispose(),
        );
      }
    });
    env.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
