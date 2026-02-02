/**
 * Map marker icon configuration using PNG assets.
 * All icons located in src/assets/map-icons/ with @2x/@3x variants.
 */

import { LayerKey } from './layerIcons';

/**
 * Icon base paths for each layer type.
 * React Native will automatically select @2x or @3x based on device density.
 * 
 * To switch to alternate variants, change the filename here.
 * Example: 'incident' → 'incident_alternate'
 */
export const LAYER_ICON_IMAGES: Record<LayerKey, any> = {
  roadConditions: require('@/assets/map-icons/road_conditions.png'),
  incidents: require('@/assets/map-icons/incident.png'),
  weatherStations: require('@/assets/map-icons/weather_station_alternate.png'),
  snowPlows: require('@/assets/map-icons/snow_plow.png'),
  plannedEvents: require('@/assets/map-icons/planned_event.png'),
  dmsSigns: require('@/assets/map-icons/dms.png'),
  workZones: require('@/assets/map-icons/work_zone.png'),
};

/**
 * Size for map markers rendered with SymbolLayer.
 * 48px (1.5x of base 32px) provides good visibility.
 * Adjust this value to change marker size on map.
 */
export const MARKER_ICON_SIZE = 32;

/**
 * Icon sizes for UI components.
 */
export const LAYER_ICON_SIZE_MD = 32;
export const LAYER_ICON_SIZE_LG = 64;
