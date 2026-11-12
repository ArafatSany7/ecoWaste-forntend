"use client";

/**
 * EcoScene — High-performance 3D floating eco-globe for modern light theme.
 * Optimized geometry and shaders for 60/120fps stutter-free scrolling.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Sphere,
  Torus,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { useMouseNorm } from "@/lib/three-utils";

/* ─── Lightweight Particle Field ────────────────────────────────────── */
function ParticleField({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      const t = Math.random();
      colors[i * 3]     = t < 0.5 ? 0.05 : 0.02;
      colors[i * 3 + 1] = t < 0.5 ? 0.70 : 0.60;
      colors[i * 3 + 2] = t < 0.5 ? 0.45 : 0.85;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Orbiting Rings ────────────────────────────────────────────────── */
function OrbitingRings() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.05;
    groupRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={groupRef}>
      <Torus args={[3.2, 0.012, 16, 80]}>
        <meshStandardMaterial color="#059669" transparent opacity={0.3} roughness={0.3} metalness={0.6} />
      </Torus>
      <Torus args={[4.2, 0.01, 16, 80]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color="#0284c7" transparent opacity={0.25} roughness={0.3} metalness={0.6} />
      </Torus>
      <Torus args={[5.1, 0.008, 16, 80]} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.18} roughness={0.3} metalness={0.6} />
      </Torus>
    </group>
  );
}

/* ─── Eco Globe (Optimized 64x64 Geometry) ─────────────────────────── */
function EcoGlobe() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useMouseNorm();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
    // Ultra-smooth dampened tilt
    meshRef.current.rotation.x +=
      (mouse.current.y * 0.15 - meshRef.current.rotation.x) * 0.03;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={meshRef} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.12}
          metalness={0.15}
          roughness={0.2}
          distort={0.28}
          speed={1.6}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

/* ─── Root Scene ────────────────────────────────────────────────────── */
export default function EcoScene() {
  const sceneRef = useRef<THREE.Group>(null!);
  const mouse = useMouseNorm();

  useFrame(() => {
    if (!sceneRef.current) return;
    sceneRef.current.rotation.y +=
      (mouse.current.x * 0.08 - sceneRef.current.rotation.y) * 0.03;
    sceneRef.current.rotation.x +=
      (-mouse.current.y * 0.05 - sceneRef.current.rotation.x) * 0.03;
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[8, 12, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-6, 4, 3]} intensity={1.0} color="#10b981" />
      <pointLight position={[5, -5, 2]} intensity={0.7} color="#0284c7" />

      <group ref={sceneRef}>
        <EcoGlobe />
        <OrbitingRings />
      </group>

      <ParticleField />
    </>
  );
}
