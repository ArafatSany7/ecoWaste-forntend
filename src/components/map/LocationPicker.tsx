"use client";

import { useCallback, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl, type MapRef, type MarkerDragEvent, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE, PIN_ZOOM, formatLatLng, type LatLng } from "./map-config";
import { PickupPin } from "./markers";

interface LocationPickerProps {
  value: LatLng | null;
  onChange: (value: LatLng) => void;
  className?: string;
}

type GeoState = { kind: "idle" } | { kind: "locating" } | { kind: "error"; message: string };

const GEO_ERRORS: Record<number, string> = {
  1: "Location permission was denied. Allow it in your browser, or tap the map to place the pin.",
  2: "Your location isn't available right now. Tap the map to place the pin instead.",
  3: "Finding your location took too long. Try again, or tap the map.",
};

export default function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const mapRef = useRef<MapRef>(null);
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });

  const flyTo = useCallback((p: LatLng) => {
    mapRef.current?.flyTo({ center: [p.longitude, p.latitude], zoom: PIN_ZOOM, duration: 900 });
  }, []);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeo({ kind: "error", message: "This browser can't share its location. Tap the map to place the pin." });
      return;
    }
    setGeo({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        onChange(p);
        flyTo(p);
        setGeo({ kind: "idle" });
      },
      (err) => setGeo({ kind: "error", message: GEO_ERRORS[err.code] ?? "Couldn't get your location." }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  };

  const onMapClick = (e: MapLayerMouseEvent) => {
    onChange({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
    setGeo({ kind: "idle" });
  };

  const onDragEnd = (e: MarkerDragEvent) => {
    onChange({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
  };

  return (
    <div className={className}>
      <div className="relative h-72 overflow-hidden rounded-xl border sm:h-80">
        <MapGL
          ref={mapRef}
          initialViewState={{
            latitude: value?.latitude ?? DEFAULT_CENTER.latitude,
            longitude: value?.longitude ?? DEFAULT_CENTER.longitude,
            zoom: value ? PIN_ZOOM : DEFAULT_ZOOM,
          }}
          mapStyle={MAP_STYLE}
          onClick={onMapClick}
          cursor="crosshair"
          attributionControl={{ compact: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" showCompass={false} />
          {value && (
            <Marker
              latitude={value.latitude}
              longitude={value.longitude}
              anchor="bottom"
              draggable
              onDragEnd={onDragEnd}
            >
              <PickupPin />
            </Marker>
          )}
        </MapGL>

        {!value && (
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
            <span className="rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium shadow-sm">
              Tap the map where the waste should be collected
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={useMyLocation} disabled={geo.kind === "locating"} className="min-h-11">
          {geo.kind === "locating" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crosshair className="mr-2 h-4 w-4" />}
          {geo.kind === "locating" ? "Finding you…" : "Use my location"}
        </Button>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {value ? (
            <>
              <MapPin className="mr-1 inline h-3.5 w-3.5 text-primary" />
              Pin at {formatLatLng(value)} · drag it to adjust
            </>
          ) : (
            "No pin yet"
          )}
        </p>
      </div>
      {geo.kind === "error" && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {geo.message}
        </p>
      )}
    </div>
  );
}
