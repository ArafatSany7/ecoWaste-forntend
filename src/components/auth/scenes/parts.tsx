"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export const GREEN = "#22a55a";
export const GREEN_DARK = "#157a40";
export const GREEN_DEEP = "#0f5a2e";
export const RUBBER = "#24292d";

function arrowShape(start: number, end: number, inner: number, outer: number) {
  const mid = (inner + outer) / 2;
  const head = 0.08;
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(start) * outer, Math.sin(start) * outer);
  shape.absarc(0, 0, outer, start, end, false);
  shape.lineTo(Math.cos(end) * (outer + head), Math.sin(end) * (outer + head));
  const tip = end + 0.45;
  shape.lineTo(Math.cos(tip) * mid, Math.sin(tip) * mid);
  shape.lineTo(Math.cos(end) * (inner - head), Math.sin(end) * (inner - head));
  shape.lineTo(Math.cos(end) * inner, Math.sin(end) * inner);
  shape.absarc(0, 0, inner, end, start, true);
  shape.closePath();
  return shape;
}

export function RecycleEmblem({ radius = 0.5, color = GREEN_DARK }: { radius?: number; color?: string }) {
  const geometry = useMemo(() => {
    const k = radius / 0.5;
    const shape = arrowShape(0.2, 1.5, 0.19 * k, 0.29 * k);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.01, bevelEnabled: false, curveSegments: 48 });
  }, [radius]);

  return (
    <group>
      <mesh>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[radius * 0.9, radius * 0.94, 64]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={geometry} position={[0, 0, 0.003]} rotation={[0, 0, (i * Math.PI * 2) / 3 + Math.PI / 2]}>
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function Wheel({ radius = 0.22, width = 0.16 }: { radius?: number; width?: number }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, width, 40]} />
        <meshStandardMaterial color={RUBBER} roughness={0.8} />
      </mesh>
      <mesh position={[0, width / 2 + 0.001, 0]}>
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.02, 32]} />
        <meshStandardMaterial color="#b7c0c6" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -width / 2 - 0.001, 0]}>
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.02, 32]} />
        <meshStandardMaterial color="#b7c0c6" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function GroundShadow({ y, sx, sz }: { y: number; sx: number; sz: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[sx, sz, 1]}>
      <circleGeometry args={[1, 64]} />
      <meshBasicMaterial color="#0f4d2b" transparent opacity={0.13} depthWrite={false} />
    </mesh>
  );
}

interface StaticStageProps {
  camera: [number, number, number];
  target: [number, number, number];
  fov?: number;
  children: React.ReactNode;
}

export function StaticStage({ camera, target, fov = 36, children }: StaticStageProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: camera, fov }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera: cam, invalidate }) => {
        cam.lookAt(...target);
        invalidate();
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#cfe8c0", 0.6]} />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <directionalLight position={[-6, 3, 2]} intensity={0.7} color="#e8ffd0" />
        {children}
      </Suspense>
    </Canvas>
  );
}
