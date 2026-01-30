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
  BASEMAP_RASTER_TILE_URLS,
  BASEMAP_RASTER_SOURCE_ID,
  BASEMAP_RASTER_LAYER_ID,
  MAP_STYLE_JSON,
  type Coordinates,
  type BoundingBox,
  type MapStyleSource,
  type MapStyleLayer,
  type MapStyleSpecification,
} from './map';
