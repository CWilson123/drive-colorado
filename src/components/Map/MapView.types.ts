/**
 * Type definitions for the MapView component.
 */

import type { ViewStyle } from 'react-native';
import type { MapOverlayData, MapMarkerData } from '@/types';

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

  /**
   * Trigger to center map on user location.
   * Increment this value to trigger re-centering.
   */
  centerOnUserTrigger?: number;

  /**
   * Overlay data (road conditions) to render on the map.
   */
  overlays: MapOverlayData[];

  /**
   * Marker data (incidents, weather stations, snow plows) to render on the map.
   */
  markers: MapMarkerData[];

  /**
   * Callback fired when a marker is tapped.
   */
  onMarkerPress?: (marker: MapMarkerData) => void;

  /**
   * Callback fired when a road condition overlay is tapped.
   */
  onOverlayPress?: (overlay: MapOverlayData) => void;
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
