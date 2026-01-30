/**
 * Map configuration constants for the Drive Colorado application.
 * All map-related configuration values are centralized here to ensure consistency
 * and easy maintenance across the application.
 */

/**
 * Geographic coordinate type representing latitude and longitude.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Bounding box type representing a geographic rectangle.
 */
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Default center point for the map view.
 * Set to Denver, Colorado - the state capital and geographic center of the metro area.
 * Coordinates: 39.7392°N, 104.9903°W
 */
export const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 39.7392,
  longitude: -104.9903,
};

/**
 * Default zoom level for the initial map view.
 * Level 7 provides a state-wide view showing most of Colorado's geography
 * while maintaining enough detail to see major cities and highways.
 */
export const DEFAULT_ZOOM_LEVEL: number = 7;

/**
 * Geographic bounding box for the state of Colorado.
 * These coordinates define the approximate rectangular boundaries of Colorado,
 * used for constraining map panning and ensuring users stay within the state.
 *
 * Colorado boundaries (approximate):
 * - North: 41.0°N (Wyoming border)
 * - South: 37.0°N (New Mexico/Oklahoma border)
 * - East: 102.0°W (Kansas/Nebraska border)
 * - West: 109.0°W (Utah border)
 */
export const COLORADO_BOUNDS: BoundingBox = {
  north: 41.0,
  south: 37.0,
  east: -102.0,
  west: -109.05,
};

/**
 * Minimum allowed zoom level.
 * Prevents users from zooming out too far, maintaining focus on Colorado
 * and surrounding regions. Level 5 shows Colorado and neighboring states.
 */
export const MIN_ZOOM: number = 5;

/**
 * Maximum allowed zoom level.
 * Prevents users from zooming in beyond the detail level provided by the
 * map tiles. Level 15 provides street-level detail suitable for navigation.
 */
export const MAX_ZOOM: number = 15;

/**
 * OpenStreetMap tile server URLs.
 * Uses multiple subdomains (a, b, c) for better load distribution.
 * The {z}/{x}/{y} placeholders are replaced by MapLibre with the appropriate
 * zoom level and tile coordinates.
 *
 * Note: For production use, consider using a tile service with higher rate limits
 * or your own tile server to avoid exceeding OpenStreetMap's usage policy.
 */
export const OSM_TILE_URLS: string[] = [
  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
];

/**
 * Carto raster tile URLs for the base map.
 * Carto's CDN-backed tiles are less likely to be blocked in native environments
 * than the default OpenStreetMap tile servers and include roads + boundaries.
 */
export const BASEMAP_RASTER_TILE_URLS: string[] = [
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
];

/**
 * MapLibre style IDs for raster tile rendering.
 */
export const BASEMAP_RASTER_SOURCE_ID: string = 'basemap-raster';
export const BASEMAP_RASTER_LAYER_ID: string = 'basemap-raster-layer';

export interface MapStyleSource {
  type: 'raster';
  tiles: string[];
  tileSize: number;
  attribution: string;
  maxzoom: number;
}

export interface MapStyleLayer {
  id: string;
  type: 'background';
  paint: {
    'background-color': string;
  };
}

export interface MapStyleSpecification {
  version: number;
  name: string;
  sources: Record<string, MapStyleSource>;
  layers: MapStyleLayer[];
}

/**
 * Minimal MapLibre style specification for raster tiles.
 * Keeps the style lightweight while raster layers are injected via MapLibre components.
 */
export const MAP_STYLE_JSON: MapStyleSpecification = {
  version: 8,
  name: 'Drive Colorado Base',
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#FFFFFF',
      },
    },
  ],
};
