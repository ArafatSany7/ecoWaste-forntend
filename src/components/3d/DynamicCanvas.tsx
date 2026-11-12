"use client";

/**
 * SSR-safe, lazily-loaded R3F Canvas wrapper.
 * All 3D scenes import this instead of @react-three/fiber directly
 * to guarantee no SSR crash in Next.js.
 *
 * Usage:
 *   const DynamicCanvas = dynamic(() => import("@/components/3d/DynamicCanvas"), { ssr: false });
 *   <DynamicCanvas><MyScene /></DynamicCanvas>
 */

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Suspense } from "react";

interface DynamicCanvasProps extends Omit<CanvasProps, "children"> {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function DynamicCanvas({
  children,
  fallback = null,
  ...canvasProps
}: DynamicCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      {...canvasProps}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </Canvas>
  );
}

