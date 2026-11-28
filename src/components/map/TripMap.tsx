"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocateFixed } from "lucide-react";
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE, PIN_ZOOM, type LatLng } from "./map-config";
import { PickupPin, VehicleMarker } from "./markers";

interface TripMapProps {
  destination: LatLng | null;
  vehicle: (LatLng & { heading: number | null }) | null;
  vehicleLabel?: string;
  className?: string;
}

export default function TripMap({ destination, vehicle, vehicleLabel, className }: TripMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [loaded, setLoaded] = useState(false);
  const [userMoved, setUserMoved] = useState(false);

  const frame = useCallback(
    (animate: boolean) => {
      const map = mapRef.current;
      if (!map) return;
      const points = [destination, vehicle].filter((p): p is LatLng & { heading?: number | null } => p != null);
      if (points.length === 0) return;
      if (points.length === 1) {
        map.easeTo({ center: [points[0].longitude, points[0].latitude], zoom: PIN_ZOOM, duration: animate ? 800 : 0 });
        return;
      }
      const lngs = points.map((p) => p.longitude);
      const lats = points.map((p) => p.latitude);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 64, maxZoom: 16.5, duration: animate ? 800 : 0 },
      );
    },
    [destination, vehicle],
  );

  useEffect(() => {
    if (loaded && !userMoved) frame(true);
  }, [loaded, userMoved, frame]);

  const start = destination ?? vehicle ?? DEFAULT_CENTER;

  return (
    <div className={`relative overflow-hidden rounded-xl border ${className ?? "h-72"}`}>
      <MapGL
        ref={mapRef}
        initialViewState={{ latitude: start.latitude, longitude: start.longitude, zoom: destination || vehicle ? PIN_ZOOM : DEFAULT_ZOOM }}
        mapStyle={MAP_STYLE}
        attributionControl={{ compact: true }}
        onLoad={() => setLoaded(true)}
        onDragStart={() => setUserMoved(true)}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {destination && (
          <Marker latitude={destination.latitude} longitude={destination.longitude} anchor="bottom">
            <PickupPin />
          </Marker>
        )}
        {vehicle && (
          <Marker latitude={vehicle.latitude} longitude={vehicle.longitude} anchor="center">
            <VehicleMarker heading={vehicle.heading} label={vehicleLabel} />
          </Marker>
        )}
      </MapGL>
      {userMoved && (
        <button
          type="button"
          onClick={() => {
            setUserMoved(false);
            frame(true);
          }}
          className="absolute bottom-3 left-3 flex min-h-11 items-center gap-2 rounded-full bg-background/95 px-4 text-sm font-medium shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LocateFixed className="h-4 w-4" />
          Recenter
        </button>
      )}
    </div>
  );
}
