/**
 * Type definitions for the TopBar component.
 */

import type { ViewStyle } from 'react-native';

/**
 * Props for the TopBar component.
 */
export interface TopBarProps {
  /**
   * Callback fired when the hamburger menu button is pressed.
   */
  onMenuPress: () => void;

  /**
   * Callback fired when the layer button is pressed.
   */
  onLayerPress: () => void;

  /**
   * Callback fired when search text changes.
   */
  onSearchChange?: (text: string) => void;

  /**
   * Callback fired when search is submitted.
   */
  onSearchSubmit?: (text: string) => void;

  /**
   * Current search value (controlled input).
   */
  searchValue?: string;

  /**
   * Optional style overrides for the container.
   */
  style?: ViewStyle;
}
