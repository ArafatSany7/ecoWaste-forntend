// Shared map settings. OpenFreeMap serves free OpenStreetMap vector tiles with no API key.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

/** Dhaka city centre — the default view before a location is chosen. */
export const DEFAULT_CENTER = { latitude: 23.8103, longitude: 90.4125 };
export const DEFAULT_ZOOM = 11.5;
export const PIN_ZOOM = 16;

export interface LatLng {
  latitude: number;
  longitude: number;
}

export const formatLatLng = ({ latitude, longitude }: LatLng) =>
  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
