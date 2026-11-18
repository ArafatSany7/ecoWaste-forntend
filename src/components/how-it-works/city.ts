import * as THREE from "three";

// City is a square grid of blocks on the XZ plane, roads run between them.
export const PITCH = 2.6;
export const BLOCK = 1.9;
export const GRID = 6; // blocks from -GRID..GRID

export const at = (b: number) => b * PITCH;
/** Road centreline between block b and b+1. */
export const road = (b: number) => (b + 0.5) * PITCH;

export const DEPOT_BLOCK = [-4, 3] as const;
export const HOME_BLOCK = [3, -3] as const;
const PARKS = new Set(["0,0", "-2,-2", "1,3", "-3,-4", "4,1", "-5,0"]);

export const DEPOT = new THREE.Vector3(at(DEPOT_BLOCK[0]), 0, at(DEPOT_BLOCK[1]));
export const HOME = new THREE.Vector3(at(HOME_BLOCK[0]) - 0.45, 0, at(HOME_BLOCK[1]));

export const CITY_CENTER = new THREE.Vector3(0, 0, 0);
export const ROUTE_CENTER = new THREE.Vector3(-1, 0, 0);

/** Deterministic hash → 0..1, so the city is identical on every render. */
function hash(x: number, z: number, s = 0) {
  const h = Math.sin(x * 127.1 + z * 311.7 + s * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

const BUILDING_COLORS = ["#ffffff", "#f4f7f3", "#eaf1eb", "#dfe9e2", "#d3e6d9"];
const TREE_COLORS = ["#8fca7c", "#7dbd6c", "#a4d68a", "#6fb262"];

export interface Box {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface CityLayout {
  blocks: Box[];
  parks: Box[];
  buildings: Box[];
  trees: Box[];
}

export function buildCity(): CityLayout {
  const blocks: Box[] = [];
  const parks: Box[] = [];
  const buildings: Box[] = [];
  const trees: Box[] = [];

  const addTree = (x: number, z: number, s: number) => {
    const r = 0.16 + hash(x, z, 9) * 0.12;
    trees.push({
      position: [x, 0.05 + r, z],
      scale: [r, r * 1.1, r],
      color: TREE_COLORS[Math.floor(hash(x, z, s) * TREE_COLORS.length)],
    });
  };

  for (let bx = -GRID; bx <= GRID; bx++) {
    for (let bz = -GRID; bz <= GRID; bz++) {
      const cx = at(bx);
      const cz = at(bz);
      const key = `${bx},${bz}`;
      const isDepot = bx === DEPOT_BLOCK[0] && bz === DEPOT_BLOCK[1];
      const isHome = bx === HOME_BLOCK[0] && bz === HOME_BLOCK[1];

      if (PARKS.has(key)) {
        parks.push({ position: [cx, 0.03, cz], scale: [BLOCK, 0.06, BLOCK], color: "#cfe8bf" });
        for (let t = 0; t < 7; t++) {
          addTree(cx + (hash(bx, bz, t) - 0.5) * 1.5, cz + (hash(bz, bx, t + 3) - 0.5) * 1.5, t);
        }
        continue;
      }

      blocks.push({ position: [cx, 0.025, cz], scale: [BLOCK, 0.05, BLOCK], color: "#ffffff" });
      if (isDepot) continue;

      if (isHome) {
        // Neighbouring low houses so the pickup home sits in a residential street.
        [
          [0.45, -0.45],
          [0.45, 0.45],
        ].forEach(([ox, oz], i) => {
          buildings.push({ position: [cx + ox, 0.24, cz + oz], scale: [0.6, 0.38, 0.6], color: BUILDING_COLORS[1 + i] });
        });
        addTree(cx - 0.45, cz - 0.6, 1);
        addTree(cx - 0.45, cz + 0.6, 2);
        continue;
      }

      // Downtown gets taller towards the centre of the grid.
      const d = Math.hypot(bx, bz) / (GRID * Math.SQRT2);
      const skyline = 0.35 + (1 - d) * (1 - d) * 2.2;

      if (hash(bx, bz, 1) < 0.22) {
        const h = skyline * (0.7 + hash(bx, bz, 2) * 0.6);
        buildings.push({
          position: [cx, 0.05 + h / 2, cz],
          scale: [1.55, h, 1.55],
          color: BUILDING_COLORS[Math.floor(hash(bx, bz, 3) * BUILDING_COLORS.length)],
        });
        continue;
      }

      for (const ox of [-0.45, 0.45]) {
        for (const oz of [-0.45, 0.45]) {
          const s = hash(cx + ox, cz + oz, 4);
          if (s < 0.14) {
            addTree(cx + ox, cz + oz, 5);
            continue;
          }
          const h = skyline * (0.35 + s * 0.85);
          buildings.push({
            position: [cx + ox, 0.05 + h / 2, cz + oz],
            scale: [0.74, h, 0.74],
            color: BUILDING_COLORS[Math.floor(hash(cx + ox, cz + oz, 6) * BUILDING_COLORS.length)],
          });
        }
      }
    }
  }

  return { blocks, parks, buildings, trees };
}

/** Polyline through road intersections with smooth rounded corners. */
function roundedPath(points: THREE.Vector3[], radius: number) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  let cursor = points[0].clone();
  for (let i = 1; i < points.length - 1; i++) {
    const corner = points[i];
    const inDir = corner.clone().sub(points[i - 1]).normalize();
    const outDir = points[i + 1].clone().sub(corner).normalize();
    const a = corner.clone().addScaledVector(inDir, -radius);
    const b = corner.clone().addScaledVector(outDir, radius);
    path.add(new THREE.LineCurve3(cursor, a));
    path.add(new THREE.QuadraticBezierCurve3(a, corner, b));
    cursor = b;
  }
  path.add(new THREE.LineCurve3(cursor, points[points.length - 1]));
  path.arcLengthDivisions = 2000;
  return path;
}

export function buildRoute() {
  const y = 0;
  const pts = [
    [road(DEPOT_BLOCK[0]) , at(DEPOT_BLOCK[1])],
    [road(DEPOT_BLOCK[0]), road(2)],
    [road(-1), road(2)],
    [road(-1), road(-1)],
    [road(2), road(-1)],
    [road(2), at(HOME_BLOCK[1])],
  ].map(([x, z]) => new THREE.Vector3(x, y, z));
  return roundedPath(pts, 0.55);
}

/** Flat ribbon mesh along a curve; drawRange lets us reveal it progressively. */
export function ribbonGeometry(curve: THREE.Curve<THREE.Vector3>, samples: number, width: number) {
  const positions = new Float32Array((samples + 1) * 2 * 3);
  const index: number[] = [];
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    curve.getPointAt(u, p);
    curve.getTangentAt(u, t);
    const nx = -t.z;
    const nz = t.x;
    const len = Math.hypot(nx, nz) || 1;
    const hx = (nx / len) * (width / 2);
    const hz = (nz / len) * (width / 2);
    positions.set([p.x + hx, p.y, p.z + hz, p.x - hx, p.y, p.z - hz], i * 6);
    if (i < samples) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(index);
  return geo;
}
