"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { Truck } from "@/components/auth/scenes/TruckScene";
import { RecycleEmblem, GroundShadow, GREEN, GREEN_DARK } from "@/components/auth/scenes/parts";
import {
  buildCity,
  buildRoute,
  ribbonGeometry,
  type Box,
  CITY_CENTER,
  DEPOT,
  HOME,
  ROUTE_CENTER,
} from "./city";
import { DISPATCH, STEPS, easeInOutCubic, easeOutCubic, segment, truckProgress } from "./story";

const BG = "#f8faf5";
const GROUND = "#e3ebe2";
const ACCENT = "#1f8f4e";
const LIME = "#b9e35a";

const ROUTE_SAMPLES = 480;
const TRUCK_SCALE = 0.14;



const [REQUEST, APPROVE, , COLLECT, PAY] = STEPS.map((s) => s.range);

type Target = THREE.Vector3 | "truck";
interface CamKey {
  p: number;
  target: Target;
  dist: number;
  polar: number;
  az: number;
}

const CAM: CamKey[] = [
  { p: 0, target: CITY_CENTER, dist: 40, polar: 0.98, az: -0.7 },
  { p: REQUEST[0], target: CITY_CENTER, dist: 36, polar: 0.95, az: -0.6 },
  { p: REQUEST[0] + 0.06, target: HOME, dist: 8.5, polar: 0.88, az: -0.35 },
  { p: REQUEST[1] - 0.01, target: HOME, dist: 7.5, polar: 0.82, az: -0.1 },
  { p: APPROVE[0] + 0.06, target: ROUTE_CENTER, dist: 30, polar: 0.42, az: -0.3 },
  { p: APPROVE[1] - 0.01, target: ROUTE_CENTER, dist: 28, polar: 0.38, az: -0.25 },
  { p: DISPATCH[0] + 0.04, target: "truck", dist: 10, polar: 0.9, az: -0.75 },
  { p: DISPATCH[1] - 0.03, target: "truck", dist: 10, polar: 0.92, az: -0.15 },
  { p: COLLECT[0] + 0.04, target: HOME, dist: 6.2, polar: 0.86, az: 0.25 },
  { p: COLLECT[1] - 0.01, target: HOME, dist: 5.8, polar: 0.84, az: 0.35 },
  { p: PAY[0] + 0.08, target: CITY_CENTER, dist: 34, polar: 0.7, az: -0.4 },
  { p: 1, target: CITY_CENTER, dist: 38, polar: 0.72, az: -0.5 },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

function cameraAt(p: number, truck: THREE.Vector3, out: { target: THREE.Vector3; dist: number; polar: number; az: number }) {
  let i = 0;
  while (i < CAM.length - 2 && p > CAM[i + 1].p) i++;
  const a = CAM[i];
  const b = CAM[i + 1];
  const k = easeInOutCubic(segment(p, a.p, b.p));
  tmpA.copy(a.target === "truck" ? truck : a.target);
  tmpB.copy(b.target === "truck" ? truck : b.target);
  out.target.lerpVectors(tmpA, tmpB, k);
  out.dist = THREE.MathUtils.lerp(a.dist, b.dist, k);
  out.polar = THREE.MathUtils.lerp(a.polar, b.polar, k);
  out.az = THREE.MathUtils.lerp(a.az, b.az, k);
}

// ---------- Scene pieces ----------

function Instanced({ items, geometry, castShadow, receiveShadow, roughness = 0.9 }: {
  items: Box[];
  geometry: THREE.BufferGeometry;
  castShadow?: boolean;
  receiveShadow?: boolean;
  roughness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const c = new THREE.Color();
    items.forEach((it, i) => {
      m.compose(new THREE.Vector3(...it.position), q, new THREE.Vector3(...it.scale));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(it.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, items.length]} castShadow={castShadow} receiveShadow={receiveShadow}>
      <meshStandardMaterial roughness={roughness} />
    </instancedMesh>
  );
}

function City() {
  const city = useMemo(() => buildCity(), []);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const tree = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color={GROUND} roughness={1} />
      </mesh>
      <Instanced items={city.blocks} geometry={box} receiveShadow />
      <Instanced items={city.parks} geometry={box} receiveShadow />
      <Instanced items={city.buildings} geometry={box} castShadow receiveShadow roughness={0.75} />
      <Instanced items={city.trees} geometry={tree} castShadow />
    </group>
  );
}

function Depot() {
  return (
    <group position={DEPOT}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.57, 0]} castShadow>
        <boxGeometry args={[1.56, 0.06, 1.36]} />
        <meshStandardMaterial color={GREEN} roughness={0.5} />
      </mesh>
      <group position={[0, 0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <RecycleEmblem radius={0.42} color={GREEN_DARK} />
      </group>
    </group>
  );
}

function Home() {
  return (
    <group position={HOME}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.52, 0.32, 4]} />
        <meshStandardMaterial color={GREEN} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Bin({ progress }: { progress: MotionValue<number> }) {
  const lid = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!lid.current) return;
    // Lid flips open while the collector empties the bin, then closes.
    const p = progress.get();
    const open = Math.sin(Math.PI * segment(p, COLLECT[0] + 0.02, COLLECT[1] - 0.04));
    lid.current.rotation.z = -open * 1.6;
  });
  return (
    <group position={[HOME.x - 0.38, 0, HOME.z + 0.45]}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.22, 20]} />
        <meshStandardMaterial color={GREEN_DARK} roughness={0.5} />
      </mesh>
      <group ref={lid} position={[0.08, 0.245, 0]}>
        <mesh position={[-0.08, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.025, 20]} />
          <meshStandardMaterial color={GREEN} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Pin({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const p = progress.get();
    const drop = easeOutCubic(segment(p, REQUEST[0] + 0.03, REQUEST[0] + 0.09));
    const lift = easeInOutCubic(segment(p, PAY[0], PAY[0] + 0.06));
    const s = drop * (1 - lift);
    if (group.current) {
      group.current.position.y = 1.15 + (1 - drop) * 2.4;
      group.current.scale.setScalar(Math.max(s, 0.0001));
    }
    if (ring.current) {
      ring.current.scale.setScalar(0.4 + drop * 0.6);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * s;
    }
  });
  return (
    <group position={[HOME.x, 0, HOME.z]}>
      <group ref={group}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={ACCENT} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0.14]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.13, 0.36, 24]} />
          <meshStandardMaterial color={ACCENT} roughness={0.3} />
        </mesh>
      </group>
      <mesh ref={ring} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.7, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Route({ route, progress }: { route: THREE.CurvePath<THREE.Vector3>; progress: MotionValue<number> }) {
  const planned = useMemo(() => ribbonGeometry(route, ROUTE_SAMPLES, 0.26), [route]);
  const driven = useMemo(() => ribbonGeometry(route, ROUTE_SAMPLES, 0.18), [route]);
  const plannedMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const p = progress.get();
    // Route is "computed" while the admin approves, then filled in as the truck drives.
    const plan = easeInOutCubic(segment(p, APPROVE[0] + 0.04, APPROVE[1] - 0.03));
    const drive = truckProgress(p);
    const tri = (f: number) => Math.floor(f * ROUTE_SAMPLES) * 6;
    planned.setDrawRange(0, tri(plan));
    driven.setDrawRange(0, tri(drive));
    if (plannedMat.current) {
      plannedMat.current.opacity = 0.85 * (1 - easeInOutCubic(segment(p, PAY[0] + 0.04, PAY[0] + 0.12)) * 0.6);
    }
  });

  return (
    <group position={[0, 0.012, 0]}>
      <mesh geometry={planned} renderOrder={1}>
        <meshBasicMaterial ref={plannedMat} color={LIME} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={driven} position={[0, 0.004, 0]} renderOrder={2}>
        <meshBasicMaterial color={ACCENT} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function MovingTruck({ route, progress, truckPos }: {
  route: THREE.CurvePath<THREE.Vector3>;
  progress: MotionValue<number>;
  truckPos: THREE.Vector3;
}) {
  const ref = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!ref.current || !body.current) return;
    const u = truckProgress(progress.get());
    route.getPointAt(u, truckPos);
    route.getTangentAt(Math.min(u, 0.999), tangent);
    ref.current.position.set(truckPos.x, 1.05 * TRUCK_SCALE + 0.02, truckPos.z);
    body.current.rotation.y = Math.atan2(-tangent.z, tangent.x);
  });
  return (
    <group ref={ref}>
      <group ref={body} scale={TRUCK_SCALE}>
        <Truck yaw={0} />
        <GroundShadow y={-1.0} sx={2.6} sz={1.25} />
      </group>
      <MapLabel
        progress={progress}
        position={[0, 0.55, 0]}
        visible={(p) => fadeWindow(p, DISPATCH[0] - 0.01, DISPATCH[0] + 0.02, COLLECT[1] - 0.02, COLLECT[1])}
        live
      >
        EW-12 · Rahim
      </MapLabel>
    </group>
  );
}

/** 0 → 1 → 0 over [inA, inB] … [outA, outB]. */
function fadeWindow(p: number, inA: number, inB: number, outA: number, outB: number) {
  return easeInOutCubic(segment(p, inA, inB)) * (1 - easeInOutCubic(segment(p, outA, outB)));
}

/**
 * Screen-aligned DOM chip pinned to a 3D point. Opacity is written straight to the DOM in
 * the render loop, so labels cost no React renders while scrolling.
 */
function MapLabel({ progress, position, visible, live, children }: {
  progress: MotionValue<number>;
  position: [number, number, number];
  visible: (p: number) => number;
  live?: boolean;
  children: React.ReactNode;
}) {
  const el = useRef<HTMLDivElement>(null);
  useFrame(() => {
    if (!el.current) return;
    const o = visible(progress.get());
    el.current.style.opacity = o.toFixed(3);
    el.current.style.transform = `translateY(${((1 - o) * 8).toFixed(2)}px)`;
    el.current.style.visibility = o < 0.01 ? "hidden" : "visible";
  });
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div
        ref={el}
        aria-hidden
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/5 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#14301f] shadow-[0_6px_18px_-8px_rgba(16,60,35,0.45)]"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <span className="relative flex h-1.5 w-1.5">
          {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f8f4e] opacity-60" />}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1f8f4e]" />
        </span>
        {children}
      </div>
    </Html>
  );
}

/** Two expanding rings at the pickup point while the bin is being emptied. */
function CollectPulse({ progress }: { progress: MotionValue<number> }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    const t = segment(progress.get(), COLLECT[0] + 0.01, COLLECT[1] - 0.02);
    const on = t > 0 && t < 1 ? 1 : 0;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 2 + i * 0.5) % 1;
      ring.scale.setScalar(0.35 + phase * 1.9);
      (ring.material as THREE.MeshBasicMaterial).opacity = on * (1 - phase) * 0.55;
    });
  });
  return (
    <group position={[HOME.x - 0.4, 0.075, HOME.z + 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }}>
          <ringGeometry args={[0.42, 0.5, 48]} />
          <meshBasicMaterial color={LIME} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress, truckPos }: { progress: MotionValue<number>; truckPos: THREE.Vector3 }) {
  const rig = useMemo(() => ({ target: new THREE.Vector3(), dist: 0, polar: 0, az: 0 }), []);
  useFrame(({ camera, size, scene }) => {
    cameraAt(progress.get(), truckPos, rig);
    // Portrait screens need more distance to keep the same subject in frame.
    const aspect = size.width / size.height;
    const fit = THREE.MathUtils.clamp(1.15 / aspect, 1, 1.9);
    const d = rig.dist * fit;
    const sp = Math.sin(rig.polar);
    camera.position.set(
      rig.target.x + d * sp * Math.sin(rig.az),
      rig.target.y + d * Math.cos(rig.polar),
      rig.target.z + d * sp * Math.cos(rig.az),
    );
    camera.lookAt(rig.target);
    // Shift the frame so the subject sits beside the story cards (right on desktop,
    // upper half on mobile) instead of underneath them.
    const desktop = size.width >= 1024;
    const ox = desktop ? -size.width * 0.17 : 0;
    const oy = desktop ? 0 : size.height * 0.14;
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.view?.offsetX !== ox || cam.view?.offsetY !== oy) {
      cam.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = d * 1.05;
      scene.fog.far = d * 2.6 + 10;
    }
  });
  return null;
}

/** Render only when scroll progress changes — no idle GPU work. */
function Invalidator({ progress }: { progress: MotionValue<number> }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => progress.on("change", () => invalidate()), [progress, invalidate]);
  return null;
}

/**
 * Everything that casts shadows is static, so the shadow map is drawn for the first few
 * frames (once instances are placed) and then frozen — halves the per-frame GPU work.
 * Moving objects (truck, pin, bin lid) use a blob shadow or none.
 */
function StaticShadows() {
  const frames = useRef(0);
  useFrame(({ gl, invalidate }) => {
    if (frames.current >= 3) return;
    frames.current++;
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    invalidate();
  });
  return null;
}

export default function CityMap({ progress, onReady }: { progress: MotionValue<number>; onReady?: () => void }) {
  const route = useMemo(() => buildRoute(), []);
  const truckPos = useMemo(() => new THREE.Vector3(), []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      shadows="percentage"
      camera={{ fov: 34, near: 0.1, far: 300, position: [0, 30, 30] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(BG);
        onReady?.();
      }}
    >
      <fog attach="fog" args={[BG, 30, 90]} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.95} />
        <hemisphereLight args={["#ffffff", "#d9e7d3", 0.7]} />
        <directionalLight
          position={[14, 22, 9]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-camera-near={1}
          shadow-camera-far={70}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />
        <City />
        <Depot />
        <Home />
        <Bin progress={progress} />
        <Route route={route} progress={progress} />
        <Pin progress={progress} />
        <CollectPulse progress={progress} />
        <MovingTruck route={route} progress={progress} truckPos={truckPos} />
        <MapLabel
          progress={progress}
          position={[DEPOT.x, 1.3, DEPOT.z]}
          visible={(p) => fadeWindow(p, APPROVE[0] + 0.04, APPROVE[0] + 0.07, DISPATCH[0] + 0.08, DISPATCH[0] + 0.11)}
        >
          EcoWaste depot
        </MapLabel>
        <MapLabel
          progress={progress}
          position={[HOME.x, 2.05, HOME.z]}
          visible={(p) => fadeWindow(p, REQUEST[0] + 0.08, REQUEST[0] + 0.11, PAY[0], PAY[0] + 0.03)}
        >
          Pickup · House 14
        </MapLabel>
        <CameraRig progress={progress} truckPos={truckPos} />
        <Invalidator progress={progress} />
        <StaticShadows />
      </Suspense>
    </Canvas>
  );
}
