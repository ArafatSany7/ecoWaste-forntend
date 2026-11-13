"use client";

import { RoundedBox } from "@react-three/drei";
import { GREEN, GREEN_DARK, GREEN_DEEP, RecycleEmblem, Wheel, GroundShadow, StaticStage } from "./parts";

const WHITE = "#f3f6f4";
const GLASS = "#1d3b4a";
const BODY_W = 1.56;
const CAB_W = 1.46;
const WHEEL_Y = -0.72;

function Cab() {
  const front = 2.13;
  return (
    <group>
      <RoundedBox args={[1.15, 1.3, CAB_W]} radius={0.16} smoothness={4} position={[1.55, 0.18, 0]}>
        <meshPhysicalMaterial color={WHITE} roughness={0.3} clearcoat={0.8} />
      </RoundedBox>
      <RoundedBox args={[1.17, 0.14, CAB_W + 0.02]} radius={0.05} position={[1.55, -0.12, 0]}>
        <meshStandardMaterial color={GREEN} roughness={0.4} />
      </RoundedBox>

      <mesh position={[front + 0.001, 0.43, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.18, 0.52]} />
        <meshPhysicalMaterial color={GLASS} roughness={0.08} metalness={0.3} clearcoat={1} />
      </mesh>
      <mesh position={[1.62, 0.43, CAB_W / 2 + 0.001]}>
        <planeGeometry args={[0.66, 0.46]} />
        <meshPhysicalMaterial color={GLASS} roughness={0.08} metalness={0.3} clearcoat={1} />
      </mesh>

      <RoundedBox args={[0.06, 0.32, 0.8]} radius={0.02} position={[front + 0.02, -0.3, 0]}>
        <meshStandardMaterial color="#2e3439" roughness={0.6} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[front + 0.02, -0.3, side * 0.56]}>
          <boxGeometry args={[0.05, 0.14, 0.2]} />
          <meshStandardMaterial color="#fff6c8" emissive="#fff1a8" emissiveIntensity={0.6} />
        </mesh>
      ))}
      <RoundedBox args={[0.2, 0.18, CAB_W + 0.06]} radius={0.05} position={[front + 0.06, -0.6, 0]}>
        <meshStandardMaterial color="#3a4147" roughness={0.5} />
      </RoundedBox>

      <RoundedBox args={[0.28, 0.08, 0.7]} radius={0.03} position={[1.45, 0.88, 0]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.35} />
      </RoundedBox>
      <mesh position={[1.9, 0.38, CAB_W / 2 + 0.12]}>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshStandardMaterial color="#2e3439" />
      </mesh>
    </group>
  );
}

function Body() {
  return (
    <group>
      <RoundedBox args={[2.75, 1.75, BODY_W]} radius={0.14} smoothness={4} position={[-0.42, 0.42, 0]}>
        <meshPhysicalMaterial color={GREEN} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[2.77, 0.16, BODY_W + 0.02]} radius={0.05} position={[-0.42, -0.12, 0]}>
        <meshStandardMaterial color={WHITE} roughness={0.4} />
      </RoundedBox>
      {[-1.3, 0.45].map((x) => (
        <RoundedBox key={x} args={[0.06, 1.62, BODY_W + 0.03]} radius={0.02} position={[x, 0.45, 0]}>
          <meshStandardMaterial color={GREEN_DARK} roughness={0.45} />
        </RoundedBox>
      ))}
      <group position={[-0.42, 0.62, BODY_W / 2 + 0.012]}>
        <RecycleEmblem radius={0.42} />
      </group>

      <RoundedBox args={[0.4, 1.55, 1.5]} radius={0.12} smoothness={4} position={[-1.92, 0.32, 0]} rotation={[0, 0, -0.06]}>
        <meshPhysicalMaterial color={GREEN_DARK} roughness={0.35} clearcoat={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.5, 1.2]} radius={0.03} position={[-2.14, -0.2, 0]}>
        <meshStandardMaterial color={GREEN_DEEP} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

function Truck() {
  return (
    <group rotation={[0, -0.32, 0]}>
      <RoundedBox args={[4.2, 0.26, 1.2]} radius={0.06} position={[-0.05, -0.52, 0]}>
        <meshStandardMaterial color="#2e3439" roughness={0.6} />
      </RoundedBox>
      <Cab />
      <Body />
      {[1.5, -0.75, -1.4].map((x) =>
        [-1, 1].map((side) => (
          <group key={`${x}-${side}`} position={[x, WHEEL_Y, side * 0.66]}>
            <Wheel radius={0.33} width={0.26} />
          </group>
        ))
      )}
      {[1.5, -1.07].map((x) => (
        <RoundedBox key={x} args={[x > 0 ? 0.86 : 1.5, 0.08, BODY_W + 0.06]} radius={0.03} position={[x, -0.33, 0]}>
          <meshStandardMaterial color="#3a4147" roughness={0.5} />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function TruckScene() {
  return (
    <StaticStage camera={[4.6, 2.6, 9.4]} target={[0, -0.75, 0]}>
      <group position={[0, -0.1, 0]}>
        <Truck />
        <GroundShadow y={WHEEL_Y - 0.33} sx={2.6} sz={1.25} />
      </group>
    </StaticStage>
  );
}
