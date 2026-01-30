/**
 * Type definitions for the LayerDropdown component.
 */

/**
 * Represents a map layer that can be toggled on/off.
 */
export interface MapLayer {
  /**
   * Unique identifier for the layer.
   */
  id: string;

  /**
   * Display name for the layer.
   */
  name: string;

  /**
   * Emoji icon for the layer.
   */
  icon: string;

  /**
   * Background color for the icon container.
   */
  iconBackground: string;

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
   * Array of map layers to display.
   */
  layers: MapLayer[];

  /**
   * Callback fired when a layer toggle is pressed.
   */
  onToggleLayer: (id: string) => void;
}
