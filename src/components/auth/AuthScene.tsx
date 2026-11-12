"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, TorusKnot, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Hero({ speed }: { speed: number }) {
  const knot = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    knot.current.rotation.x += d * 0.25 * speed;
    knot.current.rotation.y += d * 0.4 * speed;
  });
  return (
    <TorusKnot ref={knot} args={[1, 0.34, 220, 36, 2, 3]}>
      <meshPhysicalMaterial
        color="#a6e22e"
        roughness={0.12}
        metalness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.05}
        emissive="#3f8f1f"
        emissiveIntensity={0.18}
      />
    </TorusKnot>
  );
}

function Orbiters({ speed }: { speed: number }) {
  const group = useRef<THREE.Group>(null!);
  const items = useMemo(() => {
    const rand = seeded(11);
    return Array.from({ length: 14 }, (_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      radius: 2.4 + rand() * 1.3,
      y: (rand() - 0.5) * 2.6,
      size: 0.08 + rand() * 0.16,
      tone: rand() < 0.5 ? "#ffffff" : "#1f7a4d",
    }));
  }, []);
  useFrame((_, d) => {
    group.current.rotation.y += d * 0.18 * speed;
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Sphere
          key={i}
          args={[it.size, 24, 24]}
          position={[Math.cos(it.angle) * it.radius, it.y, Math.sin(it.angle) * it.radius]}
        >
          <meshPhysicalMaterial color={it.tone} roughness={0.2} clearcoat={1} />
        </Sphere>
      ))}
    </group>
  );
}

function Rig({ speed, children }: { speed: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const { x, y } = state.pointer;
    ref.current.rotation.y += (x * 0.5 * speed - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-y * 0.3 * speed - ref.current.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export default function AuthScene({ reduceMotion }: { reduceMotion: boolean }) {
  const speed = reduceMotion ? 0 : 1;
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 6, 5]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-5, -2, 3]} intensity={30} color="#d8ff5c" />
        <pointLight position={[4, -4, -2]} intensity={18} color="#34d399" />
        <Rig speed={speed}>
          <Float speed={reduceMotion ? 0 : 1.4} rotationIntensity={0.3} floatIntensity={0.8}>
            <Hero speed={speed} />
          </Float>
          <Orbiters speed={speed} />
          <Float speed={reduceMotion ? 0 : 1.8} floatIntensity={1.2} position={[-2.6, 1.6, -0.5]}>
            <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.2} smoothness={5}>
              <meshPhysicalMaterial color="#ffffff" roughness={0.08} clearcoat={1} />
            </RoundedBox>
          </Float>
          <Float speed={reduceMotion ? 0 : 1.2} floatIntensity={1} position={[2.7, -1.5, 0.4]}>
            <Torus args={[0.6, 0.2, 32, 64]} rotation={[1, 0.4, 0]}>
              <meshPhysicalMaterial color="#1f7a4d" roughness={0.15} clearcoat={1} />
            </Torus>
          </Float>
        </Rig>
      </Suspense>
    </Canvas>
  );
}
