/**
 * Layer icon configuration using PNG assets.
 * Replaces Lucide React Native icons with custom PNG images.
 */

import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { LAYER_ICON_IMAGES } from './mapIcons';

/**
 * Valid layer keys that have icon mappings.
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
  /** The PNG image source */
  image: ImageSourcePropType;
}

/**
 * Mapping of layer keys to their icon configuration.
 * 
 * To change to alternate variants, update LAYER_ICON_IMAGES in mapIcons.ts
 */
export const LAYER_ICONS: Record<LayerKey, LayerIconConfig> = {
  roadConditions: { image: LAYER_ICON_IMAGES.roadConditions },
  incidents: { image: LAYER_ICON_IMAGES.incidents },
  weatherStations: { image: LAYER_ICON_IMAGES.weatherStations },
  snowPlows: { image: LAYER_ICON_IMAGES.snowPlows },
  plannedEvents: { image: LAYER_ICON_IMAGES.plannedEvents },
  dmsSigns: { image: LAYER_ICON_IMAGES.dmsSigns },
  workZones: { image: LAYER_ICON_IMAGES.workZones },
};

/**
 * Default icon sizes used across the app.
 */
export const LAYER_ICON_SIZE_SM = 32;
export const LAYER_ICON_SIZE_MD = 32;
export const LAYER_ICON_SIZE_LG = 64;

/**
 * Props for the LayerIcon component.
 */
export interface LayerIconProps {
  /** The layer key to render the icon for */
  layerKey: LayerKey;
  /** Icon size in pixels (default: 24) */
  size?: number;
  /** Additional styles for the icon container */
  style?: any;
}

/**
 * LayerIcon component - renders PNG icon for a layer.
 *
 * Usage:
 *   <LayerIcon layerKey="incidents" />
 *   <LayerIcon layerKey="incidents" size={32} />
 */
export const LayerIcon: React.FC<LayerIconProps> = ({
  layerKey,
  size = LAYER_ICON_SIZE_MD,
  style,
}) => {
  const config = LAYER_ICONS[layerKey];

  if (!config) {
    console.warn(`LayerIcon: Unknown layer key "${layerKey}"`);
    return null;
  }

  return (
    <Image
      source={config.image}
      style={[styles.icon, { width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};

/**
 * Get the icon configuration for a layer key.
 */
export const getLayerIconConfig = (layerKey: LayerKey): LayerIconConfig | undefined => {
  return LAYER_ICONS[layerKey];
};

const styles = StyleSheet.create({
  icon: {
    flexShrink: 0,
  },
});
