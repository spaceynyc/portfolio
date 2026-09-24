import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useInView, useReducedMotion, webglAvailable } from './useMotionPrefs';

// A procedural version of the brand's chrome cube sculpture: a stacked cluster of
// rounded chrome cubes, an orbit ring, and two iridescent four-point sparkles.

const CUBES: Array<{ p: [number, number, number]; r: [number, number, number]; s: number }> = [
  { p: [0.0, -0.75, 0.2], r: [0.15, 0.6, 0.05], s: 1.55 },
  { p: [-1.35, -0.55, -0.4], r: [0.2, -0.4, 0.3], s: 1.3 },
  { p: [1.35, -0.6, -0.5], r: [-0.1, 0.9, -0.2], s: 1.25 },
  { p: [-0.55, 0.55, -0.2], r: [0.5, 0.35, 0.65], s: 1.15 },
  { p: [0.8, 0.65, 0.35], r: [-0.4, -0.5, 0.35], s: 1.0 },
  { p: [0.1, 1.55, -0.3], r: [0.7, 0.2, -0.5], s: 0.85 },
  { p: [-1.9, 0.6, 0.4], r: [0.3, 0.8, 0.1], s: 0.7 },
  { p: [2.05, 0.4, 0.5], r: [0.6, -0.3, 0.4], s: 0.62 },
];

function Sparkle({ position, scale = 1, phase = 0, reduced }: { position: [number, number, number]; scale?: number; phase?: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outer = 1, inner = 0.16;
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3 });
  }, []);
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime + phase;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.25;
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.08;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
      <meshPhysicalMaterial color="#e9e6ff" metalness={0.9} roughness={0.15} clearcoat={1} iridescence={1} iridescenceIOR={1.6} iridescenceThicknessRange={[120, 600]} envMapIntensity={1.6} />
    </mesh>
  );
}

function Cluster({ reduced, hovered }: { reduced: boolean; hovered: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const lift = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement.parentElement?.parentElement ?? gl.domElement;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const leave = () => (pointer.current = { x: 0, y: 0 });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [gl]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (reduced) { g.rotation.set(0.05, -0.35, 0); return; }
    const t = clock.elapsedTime;
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 5);
    lift.current += ((hovered ? 1 : 0) - lift.current) * k;
    const targetY = -0.35 + pointer.current.x * 0.22 + t * 0.03;
    const targetX = 0.05 - pointer.current.y * 0.12;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.position.y = Math.sin(t * 0.6) * 0.08 + lift.current * (0.18 + Math.sin(t * 1.6) * 0.05);
    g.children.forEach((c, i) => {
      c.position.y = CUBES[i] ? CUBES[i].p[1] + Math.sin(t * 0.8 + i * 1.7) * 0.035 : c.position.y;
    });
  });

  return (
    <group ref={group} rotation={[0.05, -0.35, 0]}>
      {CUBES.map((c, i) => (
        <RoundedBox key={i} args={[1, 1, 1]} radius={0.09} smoothness={6} position={c.p} rotation={c.r} scale={c.s}>
          <meshPhysicalMaterial color="#d6d6e6" metalness={1} roughness={0.07} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.35} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Ring({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (reduced) return;
    ref.current.rotation.z = -0.28 + Math.sin(clock.elapsedTime * 0.35) * 0.04;
  });
  return (
    <group ref={ref} rotation={[1.32, 0.12, -0.28]} position={[0, -0.2, 0]}>
      <mesh>
        <torusGeometry args={[3.6, 0.014, 8, 240]} />
        <meshBasicMaterial color="#d9d3ff" toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.6, 0.06, 8, 240]} />
        <meshBasicMaterial color="#8b5dff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.6, 0.16, 8, 240]} />
        <meshBasicMaterial color="#6a4bff" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#0a0a12']} />
      <Lightformer form="rect" intensity={4} color="#f0f4ff" position={[-4, 2, 4]} scale={[3, 7, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={3} color="#e7edff" position={[0, 0.2, 6]} scale={[4, 4, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={5} color="#779aff" position={[4, 0, 3]} scale={[1, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={3} color="#e4b5ff" position={[0, -3, 3]} scale={[6, 1, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[0, 5, 1]} scale={[5, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.5} color="#9bdfff" position={[-1, 0, -5]} scale={[3, 6, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

export default function HeroSculpture() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(wrap, '80px');
  const [ok, setOk] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => setOk(webglAvailable()), []);

  if (ok === false) return <div className="hero-poster" aria-hidden="true" />;
  return (
    <div ref={wrap} className="hero-canvas" data-ready={ok === true} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {ok && (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={reduced || !inView ? 'demand' : 'always'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          camera={{ fov: 30, position: [0, 0.9, 10.5], near: 0.1, far: 60 }}
          onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}
        >
          <Studio />
          <Cluster reduced={reduced} hovered={hovered} />
          <Ring reduced={reduced} />
          <Sparkle position={[-3.0, 1.4, 1.2]} scale={0.42} phase={1.3} reduced={reduced} />
          <Sparkle position={[3.4, -0.1, 1.6]} scale={0.6} phase={0.2} reduced={reduced} />
          <Sparkle position={[2.2, 2.3, -0.8]} scale={0.22} phase={2.4} reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}
