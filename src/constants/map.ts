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
 * map tiles. Level 18 provides street-level detail suitable for navigation
 * with vector tiles.
 */
export const MAX_ZOOM: number = 18;

/**
 * OpenFreeMap Liberty style URL for vector tiles.
 * Liberty is a clean, professional map style suitable for navigation applications.
 * Uses OpenMapTiles schema with data from OpenStreetMap contributors.
 *
 * @see https://openfreemap.org/
 */
export const OPENFREEMAP_LIBERTY_STYLE_URL: string =
  'https://tiles.openfreemap.org/styles/liberty'; 
