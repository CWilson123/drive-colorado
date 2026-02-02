/**
 * Centralized layer icon configuration.
 *
 * This file is the SINGLE SOURCE OF TRUTH for all layer icons in the app.
 * All components should import LayerIcon from here rather than importing
 * Lucide icons directly.
 *
 * ## How to customize icons:
 * 1. Find your desired icon at https://lucide.dev/icons
 * 2. Add the import to the imports below (use the PascalCase component name)
 * 3. Update the LAYER_ICONS mapping with the new icon component
 *
 * ## Adding a new layer:
 * 1. Add a new entry to the LayerKey type
 * 2. Add the icon import
 * 3. Add the mapping in LAYER_ICONS with icon component and default color
 */

import React from 'react';
import {
  Route,
  TriangleAlert,
  ThermometerSnowflake,
  Truck,
  CalendarClock,
  PanelBottomDashed,
  Construction,
  type LucideIcon,
} from 'lucide-react-native';
import { CO_BLUE, CO_RED, CO_GOLD, CO_GRAY } from './colors';

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
  /** The Lucide icon component */
  icon: LucideIcon;
  /** Default color for the icon */
  defaultColor: string;
  /** Background color for icon containers (lighter shade) */
  backgroundColor: string;
}

/**
 * Mapping of layer keys to their icon configuration.
 *
 * To change an icon:
 * 1. Import the new Lucide icon at the top of this file
 * 2. Update the 'icon' property for the relevant layer key
 *
 * Example:
 *   // Change incidents icon from TriangleAlert to AlertCircle
 *   import { AlertCircle } from 'lucide-react-native';
 *   incidents: { icon: AlertCircle, ... }
 */
export const LAYER_ICONS: Record<LayerKey, LayerIconConfig> = {
  roadConditions: {
    icon: Route,
    defaultColor: CO_BLUE,
    backgroundColor: '#E0F2FE', // Light blue
  },
  incidents: {
    icon: TriangleAlert,
    defaultColor: CO_RED,
    backgroundColor: '#FEE2E2', // Light red
  },
  weatherStations: {
    icon: ThermometerSnowflake,
    defaultColor: CO_BLUE,
    backgroundColor: '#FFEDD5', // Light orange
  },
  snowPlows: {
    icon: Truck,
    defaultColor: CO_GOLD,
    backgroundColor: '#DCFCE7', // Light green
  },
  // Future layers - icons ready for when these are implemented
  plannedEvents: {
    icon: CalendarClock,
    defaultColor: CO_BLUE,
    backgroundColor: '#E0E7FF', // Light indigo
  },
  dmsSigns: {
    icon: PanelBottomDashed,
    defaultColor: CO_GOLD,
    backgroundColor: '#FEF3C7', // Light yellow
  },
  workZones: {
    icon: Construction,
    defaultColor: CO_GOLD,
    backgroundColor: '#FFEDD5', // Light orange
  },
};

/**
 * Default icon size used across the app for consistency.
 */
export const LAYER_ICON_SIZE_SM = 18;
export const LAYER_ICON_SIZE_MD = 24;
export const LAYER_ICON_SIZE_LG = 28;

/**
 * Props for the LayerIcon component.
 */
export interface LayerIconProps {
  /** The layer key to render the icon for */
  layerKey: LayerKey;
  /** Icon size in pixels (default: 24) */
  size?: number;
  /** Override the default color */
  color?: string;
  /** Stroke width (default: 2) */
  strokeWidth?: number;
}

/**
 * LayerIcon component - renders the appropriate icon for a layer.
 *
 * Usage:
 *   <LayerIcon layerKey="incidents" />
 *   <LayerIcon layerKey="incidents" size={24} color="#FF0000" />
 *
 * @param props - Component props
 * @returns Rendered Lucide icon
 */
export const LayerIcon: React.FC<LayerIconProps> = ({
  layerKey,
  size = LAYER_ICON_SIZE_MD,
  color,
  strokeWidth = 2,
}) => {
  const config = LAYER_ICONS[layerKey];

  if (!config) {
    // Fallback for unknown layer keys - render nothing
    console.warn(`LayerIcon: Unknown layer key "${layerKey}"`);
    return null;
  }

  const IconComponent = config.icon;
  const iconColor = color ?? config.defaultColor;

  return React.createElement(IconComponent, {
    size,
    color: iconColor,
    strokeWidth,
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
