import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrthographicCamera, View, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from './useMotionPrefs';

type Service = { id: string; title: string; line: string };

function Studio() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={3} color="#f0f4ff" position={[-4, 2, 4]} scale={[3, 7, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.8} color="#e7edff" position={[0, 0.1, 5]} scale={[3.6, 3.6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={4} color="#779aff" position={[4, 0, 3]} scale={[1, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={3} color="#e4b5ff" position={[0, -3, 3]} scale={[6, 1, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 5, 1]} scale={[5, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} color="#9bdfff" position={[-1, 0, -5]} scale={[3, 6, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

function Rig() {
  // Matches the Blender camera used for the posters: orthographic, half-size 1.25, from (0, 1.2, 8).
  const size = useThree((s) => s.size);
  return <OrthographicCamera makeDefault position={[0, 1.2, 8]} zoom={size.height / 2.5} near={0.1} far={50} onUpdate={(c) => c.lookAt(0, 0, 0)} />;
}

function Model({ id, hovered, reduced }: { id: string; hovered: boolean; reduced: boolean }) {
  const { scene } = useGLTF(`/assets/${id}-icon.glb`);
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (!hovered || reduced) return;
    ref.current.rotation.y += Math.min(dt, 0.05) * 0.36; // one turn every ~17.5s, as before
  });
  return <primitive ref={ref} object={scene} />;
}

export default function ServiceIcons({ services }: { services: Service[] }) {
  const container = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div ref={container} className="services-grid" style={{ position: 'relative' }}>
      {services.map((s) => (
        <a
          key={s.id}
          className="service"
          href={`/#work`}
          onPointerEnter={(e) => e.pointerType !== 'touch' && setHovered(s.id)}
          onPointerLeave={() => setHovered(null)}
          data-hovered={hovered === s.id}
        >
          <View className="service-art" style={{ backgroundImage: `url(/assets/${s.id}-icon.png)` }}>
            <Rig />
            <Studio />
            <Suspense fallback={null}>
              <Model id={s.id} hovered={hovered === s.id} reduced={reduced} />
            </Suspense>
          </View>
          <span className="service-copy">
            <span className="service-title">{s.title}</span>
            <span className="service-line">{s.line.split('\n').map((l, i) => (<span key={i}>{l}<br /></span>))}</span>
          </span>
        </a>
      ))}
      <Canvas
        eventSource={container}
        dpr={[1, 1.5]}
        frameloop={hovered && !reduced ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <View.Port />
      </Canvas>
    </div>
  );
}
