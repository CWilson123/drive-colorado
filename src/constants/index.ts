/**
 * Central export point for all application constants.
 * Import constants from this file to ensure clean, organized imports throughout the app.
 *
 * Example usage:
 *   import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from '@/constants';
 */

// Map configuration constants
export {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_LEVEL,
  COLORADO_BOUNDS,
  MIN_ZOOM,
  MAX_ZOOM,
  OSM_TILE_URLS,
  MAP_STYLE_URL,
  type Coordinates,
  type BoundingBox,
} from './map';
