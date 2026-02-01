/**
 * Type definitions for the MarkerDetailSheet component.
 */

import type { MapMarkerData, MapOverlayData } from '@/types';

/**
 * Props for the MarkerDetailSheet component.
 */
export interface MarkerDetailSheetProps {
  /**
   * Whether the sheet is visible.
   */
  visible: boolean;

  /**
   * Marker data to display (for point markers).
   */
  marker: MapMarkerData | null;

  /**
   * Overlay data to display (for road condition line taps).
   */
  overlay: MapOverlayData | null;

  /**
   * Callback fired when the sheet should close.
   */
  onClose: () => void;
}

/**
 * Severity levels for incidents
 */
export type SeverityLevel = 'minor' | 'moderate' | 'major';

/**
 * Road condition types
 */
export type RoadConditionType =
  | 'Snow Packed'
  | 'Icy'
  | 'Wet'
  | 'Dry'
  | 'Closed'
  | 'Unknown';
