"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GREEN, GREEN_DARK, GREEN_DEEP, RecycleEmblem, Wheel, GroundShadow, StaticStage } from "./parts";

const W = 1.5;
const D = 1.55;
const H = 2.1;
const BASE = 0.82;

function scaleAt(y: number) {
  return THREE.MathUtils.lerp(BASE, 1, (y + H / 2) / H);
}

function useTaperedBody() {
  return useMemo(() => {
    const geo = new RoundedBoxGeometry(W, H, D, 8, 0.16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const s = scaleAt(pos.getY(i));
      pos.setX(i, pos.getX(i) * s);
      pos.setZ(i, pos.getZ(i) * s);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Rib({ y }: { y: number }) {
  const s = scaleAt(y);
  return (
    <RoundedBox args={[W * s + 0.04, 0.07, D * s + 0.04]} radius={0.03} smoothness={3} position={[0, y, 0]}>
      <meshPhysicalMaterial color={GREEN_DARK} roughness={0.4} clearcoat={0.5} />
    </RoundedBox>
  );
}

function Bin() {
  const body = useTaperedBody();
  const tilt = Math.atan(((D / 2) * (1 - BASE)) / H);
  const emblemY = 0.1;
  const emblemZ = (D / 2) * scaleAt(emblemY) + 0.012;
  const backZ = -(D / 2) - 0.08;

  return (
    <group rotation={[0, 0.18, 0]}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color={GREEN} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.2} />
      </mesh>

      <Rib y={-0.55} />
      <Rib y={0.62} />

      <group position={[0, emblemY, emblemZ]} rotation={[tilt, 0, 0]}>
        <RecycleEmblem radius={0.46} />
      </group>

      <group position={[0, H / 2 + 0.07, -0.02]}>
        <RoundedBox args={[W + 0.18, 0.14, D + 0.2]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial color={GREEN_DARK} roughness={0.3} clearcoat={0.9} />
        </RoundedBox>
        <RoundedBox args={[W - 0.1, 0.08, D - 0.1]} radius={0.04} smoothness={3} position={[0, 0.1, 0]}>
          <meshPhysicalMaterial color={GREEN_DARK} roughness={0.3} clearcoat={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.07, 0.12]} radius={0.03} position={[0, -0.04, D / 2 + 0.12]}>
          <meshStandardMaterial color={GREEN_DEEP} roughness={0.45} />
        </RoundedBox>
      </group>

      <group position={[0, H / 2 - 0.12, backZ - 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, W * 0.86, 24]} />
          <meshStandardMaterial color={GREEN_DEEP} roughness={0.4} />
        </mesh>
        {[-1, 1].map((side) => (
          <RoundedBox key={side} args={[0.1, 0.24, 0.14]} radius={0.03} position={[side * W * 0.38, 0.08, 0.05]}>
            <meshStandardMaterial color={GREEN_DEEP} roughness={0.4} />
          </RoundedBox>
        ))}
      </group>

      <group position={[0, -H / 2 + 0.2, -(D / 2) * BASE - 0.04]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, W * BASE + 0.12, 16]} />
          <meshStandardMaterial color="#6b757c" metalness={0.6} roughness={0.35} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * ((W * BASE) / 2 + 0.02), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Wheel radius={0.23} width={0.15} />
          </group>
        ))}
      </group>
    </group>
  );
}

export default function BinScene() {
  return (
    <StaticStage camera={[3.4, 2, 7.2]} target={[0, -0.55, 0]}>
      <group position={[0, -0.2, 0]}>
        <Bin />
        <GroundShadow y={-H / 2 - 0.02} sx={1.5} sz={1.3} />
      </group>
    </StaticStage>
  );
}
