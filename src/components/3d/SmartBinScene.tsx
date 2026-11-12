"use client";

/**
 * SmartBinScene — Sleek 3D smart waste container styled for modern clean white background.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

interface SmartBinSceneProps {
  fillProgress: MotionValue<number>;
}

function BinModel({ fillProgress }: SmartBinSceneProps) {
  const fillMeshRef = useRef<THREE.Mesh>(null!);
  const lidHingeRef = useRef<THREE.Group>(null!);
  const glowLightRef = useRef<THREE.PointLight>(null!);
  const ledStripRef = useRef<THREE.Mesh>(null!);

  const fillGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.62, 0.58, 1.8, 32);
    geo.translate(0, 0.9, 0); // Bottom-anchored pivot
    return geo;
  }, []);

  useFrame(() => {
    const rawT = fillProgress.get();
    const t = Math.max(0, Math.min(1, rawT));

    const dynamicColor = new THREE.Color();
    if (t < 0.5) {
      dynamicColor.lerpColors(new THREE.Color("#0284c7"), new THREE.Color("#059669"), t * 2);
    } else {
      dynamicColor.lerpColors(new THREE.Color("#059669"), new THREE.Color("#d97706"), (t - 0.5) * 2);
    }

    if (fillMeshRef.current) {
      const currentScaleY = THREE.MathUtils.lerp(0.08, 0.95, t);
      fillMeshRef.current.scale.set(1, currentScaleY, 1);

      const mat = fillMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(dynamicColor);
      mat.emissive.copy(dynamicColor);
      mat.emissiveIntensity = 0.25 + t * 0.25;
    }

    if (lidHingeRef.current) {
      const targetAngle = THREE.MathUtils.lerp(0, -Math.PI / 3.2, t);
      lidHingeRef.current.rotation.x = targetAngle;
    }

    if (ledStripRef.current) {
      const ledMat = ledStripRef.current.material as THREE.MeshStandardMaterial;
      ledMat.color.copy(dynamicColor);
      ledMat.emissive.copy(dynamicColor);
      ledMat.emissiveIntensity = 0.9;
    }

    if (glowLightRef.current) {
      glowLightRef.current.color.copy(dynamicColor);
      glowLightRef.current.intensity = THREE.MathUtils.lerp(0.6, 2.0, t);
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.35}>
      <group position={[0, -0.1, 0]}>
        {/* Outer frosted acrylic / glass canister */}
        <RoundedBox args={[1.5, 2.2, 1.5]} radius={0.14} smoothness={4} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#e2e8f0"
            emissive="#10b981"
            emissiveIntensity={0.05}
            roughness={0.1}
            metalness={0.1}
            transmission={0.7}
            thickness={0.5}
            transparent
            opacity={0.82}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* Brushed aluminum corner posts */}
        <group>
          {[-0.72, 0.72].map((x) =>
            [-0.72, 0.72].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0, z]}>
                <boxGeometry args={[0.05, 2.22, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
              </mesh>
            ))
          )}
        </group>

        {/* Base rim */}
        <mesh position={[0, -1.11, 0]}>
          <boxGeometry args={[1.56, 0.08, 1.56]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* LED Sensor Ring */}
        <mesh ref={ledStripRef} position={[0, 0.88, 0]}>
          <boxGeometry args={[1.54, 0.04, 1.54]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.0}
            toneMapped={false}
          />
        </mesh>

        {/* Liquid waste column */}
        <mesh ref={fillMeshRef} geometry={fillGeometry} position={[0, -1.0, 0]}>
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.15}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Floating sensor core */}
        <mesh position={[0, 0.1, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#059669"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>

        {/* Hinged Lid Assembly */}
        <group ref={lidHingeRef} position={[0, 1.1, -0.75]}>
          <group position={[0, 0.05, 0.75]}>
            <RoundedBox args={[1.62, 0.12, 1.62]} radius={0.04} smoothness={2}>
              <meshStandardMaterial
                color="#1e293b"
                metalness={0.8}
                roughness={0.25}
              />
            </RoundedBox>
            {/* Solar cap */}
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.9, 0.02, 0.9]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.4}
                roughness={0.1}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[0, 0.12, 0.6]}>
              <boxGeometry args={[0.35, 0.05, 0.08]} />
              <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Internal reactive light */}
        <pointLight
          ref={glowLightRef}
          position={[0, -0.2, 0]}
          intensity={1.0}
          color="#10b981"
          distance={3.5}
        />
      </group>
    </Float>
  );
}

export default function SmartBinScene({ fillProgress }: SmartBinSceneProps) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 6]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, 2, 2]} intensity={0.9} color="#0284c7" />
      <pointLight position={[4, -2, -2]} intensity={0.8} color="#059669" />
      <BinModel fillProgress={fillProgress} />
    </>
  );
}
