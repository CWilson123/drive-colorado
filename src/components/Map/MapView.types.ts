/**
 * Type definitions for the MapView component.
 */

import type { ViewStyle } from 'react-native';

/**
 * Props for the MapView component.
 */
export interface MapViewProps {
  /**
   * Optional style overrides for the map container.
   */
  style?: ViewStyle;

  /**
   * Callback fired when the map is fully loaded and ready.
   */
  onMapReady?: () => void;

  /**
   * Callback fired when there's an error loading the map.
   */
  onMapError?: (error: Error) => void;
}

/**
 * State of location permission.
 */
export enum LocationPermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
}

/**
 * User's current location data.
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}
