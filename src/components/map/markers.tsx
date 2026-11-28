import { Navigation2, Truck } from "lucide-react";

export function PickupPin() {
  return (
    <svg width="34" height="44" viewBox="0 0 34 44" aria-label="Pickup location" role="img" className="drop-shadow-md">
      <path
        d="M17 43C17 43 32 27.6 32 16.5C32 7.9 25.3 1 17 1C8.7 1 2 7.9 2 16.5C2 27.6 17 43 17 43Z"
        fill="oklch(0.5 0.15 150)"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="17" cy="16.5" r="5.5" fill="white" />
    </svg>
  );
}

export function VehicleMarker({ heading, label = "Collector" }: { heading: number | null; label?: string }) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center" role="img" aria-label={label}>
      <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.5_0.15_150/0.25)] motion-reduce:animate-none" />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[oklch(0.28_0.06_160)] text-white shadow-lg">
        {heading != null ? (
          <Navigation2 className="h-4 w-4 fill-current" style={{ transform: `rotate(${heading}deg)` }} />
        ) : (
          <Truck className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}
