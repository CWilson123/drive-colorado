/**
 * Type definitions for the LayerDropdown component.
 */

import type { LayerKey } from '@/constants';

/**
 * Represents a map layer that can be toggled on/off.
 */
export interface MapLayer {
  /**
   * Unique identifier for the layer (must match a LayerKey for icon lookup).
   */
  id: LayerKey;

  /**
   * Display name for the layer.
   */
  name: string;

  /**
   * Whether the layer is currently enabled.
   */
  enabled: boolean;
}

/**
 * Props for the LayerDropdown component.
 */
export interface LayerDropdownProps {
  /**
   * Whether the dropdown is visible.
   */
  visible: boolean;

  /**
   * Callback fired when the dropdown should close.
   */
  onClose: () => void;

  /**
   * Record of enabled layer states.
   */
  enabledLayers: Record<string, boolean>;

  /**
   * Callback fired when a layer toggle is pressed.
   */
  onToggleLayer: (id: string) => void;

  /**
   * Whether layer data is currently loading.
   */
  isLoading?: boolean;

  /**
   * Timestamp of last data update.
   */
  lastUpdated?: Date | null;
}
