/**
 * Centralized layer icon configuration.
 *
 * This file is the SINGLE SOURCE OF TRUTH for all layer icons in the app.
 * All components should import LayerIcon from here rather than importing
 * icon assets directly.
 *
 * ## How to customize icons:
 * 1. Add the PNG asset to src/assets/map-icons
 * 2. Update the LAYER_ICONS mapping with the new image require
 *
 * ## Adding a new layer:
 * 1. Add a new entry to the LayerKey type
 * 2. Add the mapping in LAYER_ICONS with the icon image
 */

import React from 'react';
import { Image, type ImageSourcePropType, type ImageStyle } from 'react-native';

export type MapMarkerLayerKey = 'incidents' | 'weatherStations' | 'snowPlows' | 'plannedEvents' | 'dmsSigns';

/**
 * Valid layer keys that have icon mappings.
 * Includes both current and planned layers for future-proofing.
 */
export type LayerKey =
  | 'roadConditions'
  | 'incidents'
  | 'weatherStations'
  | 'snowPlows'
  | 'plannedEvents'
  | 'dmsSigns'
  | 'workZones';

/**
 * Configuration for a single layer icon.
 */
export interface LayerIconConfig {
  /** Image asset used for the icon */
  icon: ImageSourcePropType;
  /** Background color for icon containers (lighter shade) */
  backgroundColor: string;
}

/**
 * Mapping of layer keys to their icon configuration.
 *
 * To change an icon:
 * 1. Drop the PNG in src/assets/map-icons
 * 2. Update the 'icon' property for the relevant layer key
 */
export const LAYER_ICONS: Record<LayerKey, LayerIconConfig> = {
  roadConditions: {
    icon: require('../assets/map-icons/road_conditions.png'),
    backgroundColor: '#E0F2FE', // Light blue
  },
  incidents: {
    icon: require('../assets/map-icons/traffic_incidents.png'),
    backgroundColor: '#FEE2E2', // Light red
  },
  weatherStations: {
    icon: require('../assets/map-icons/weather_station.png'),
    backgroundColor: '#FFEDD5', // Light orange
  },
  snowPlows: {
    icon: require('../assets/map-icons/snow_plow.png'),
    backgroundColor: '#DCFCE7', // Light green
  },
  // Future layers - icons ready for when these are implemented
  plannedEvents: {
    icon: require('../assets/map-icons/planned_event.png'),
    backgroundColor: '#E0E7FF', // Light indigo
  },
  dmsSigns: {
    icon: require('../assets/map-icons/dms.png'),
    backgroundColor: '#FEF3C7', // Light yellow
  },
  workZones: {
    icon: require('../assets/map-icons/work_zone.png'),
    backgroundColor: '#FFEDD5', // Light orange
  },
};

/**
 * Default icon size used across the app for consistency.
 */
export const LAYER_ICON_SIZE_SM = 18;
export const LAYER_ICON_SIZE_MD = 24;
export const LAYER_ICON_SIZE_LG = 28;
export const MAP_MARKER_ICON_SCALE = 0.6;
export const MAP_MARKER_ICON_ANCHOR = 'center';
export const MAP_MARKER_DIMMED_OPACITY = 0.5;

const DMS_DIMMED_ICON_NAME = 'marker-dms-signs-dimmed';

export const MAP_MARKER_ICON_NAMES: Record<MapMarkerLayerKey, string> = {
  incidents: 'marker-incidents',
  weatherStations: 'marker-weather-stations',
  snowPlows: 'marker-snow-plows',
  plannedEvents: 'marker-planned-events',
  dmsSigns: 'marker-dms-signs',
};

export const MAP_MARKER_DIMMED_ICON_NAMES: Partial<Record<MapMarkerLayerKey, string>> = {
  dmsSigns: DMS_DIMMED_ICON_NAME,
};

export const MAP_MARKER_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  [MAP_MARKER_ICON_NAMES.incidents]: require('../assets/map-icons/traffic_incidents.png'),
  [MAP_MARKER_ICON_NAMES.weatherStations]: require('../assets/map-icons/weather_station.png'),
  [MAP_MARKER_ICON_NAMES.snowPlows]: require('../assets/map-icons/snow_plow.png'),
  [MAP_MARKER_ICON_NAMES.plannedEvents]: require('../assets/map-icons/planned_event.png'),
  [MAP_MARKER_ICON_NAMES.dmsSigns]: require('../assets/map-icons/dms.png'),
  [DMS_DIMMED_ICON_NAME]: require('../assets/map-icons/dms_alternate.png'),
};

/**
 * Props for the LayerIcon component.
 */
export interface LayerIconProps {
  /** The layer key to render the icon for */
  layerKey: LayerKey;
  /** Icon size in pixels (default: 24) */
  size?: number;
  /** Optional style override for the icon */
  style?: ImageStyle;
}

/**
 * LayerIcon component - renders the appropriate icon for a layer.
 *
 * Usage:
 *   <LayerIcon layerKey="incidents" />
 *   <LayerIcon layerKey="incidents" size={24} />
 *
 * @param props - Component props
 * @returns Rendered image icon
 */
export const LayerIcon: React.FC<LayerIconProps> = ({
  layerKey,
  size = LAYER_ICON_SIZE_MD,
  style,
}) => {
  const config = LAYER_ICONS[layerKey];

  if (!config) {
    // Fallback for unknown layer keys - render nothing
    console.warn(`LayerIcon: Unknown layer key "${layerKey}"`);
    return null;
  }

  return React.createElement(Image, {
    source: config.icon,
    style: [{ width: size, height: size }, style],
    resizeMode: 'contain',
  });
};

/**
 * Get the icon configuration for a layer key.
 * Useful when you need the raw config (e.g., for background colors).
 *
 * @param layerKey - The layer key
 * @returns The icon configuration or undefined if not found
 */
export const getLayerIconConfig = (layerKey: LayerKey): LayerIconConfig | undefined => {
  return LAYER_ICONS[layerKey];
};
