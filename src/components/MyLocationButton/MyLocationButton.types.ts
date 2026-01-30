/**
 * Type definitions for the MyLocationButton component.
 */

import type { ViewStyle } from 'react-native';

/**
 * Props for the MyLocationButton component.
 */
export interface MyLocationButtonProps {
  /**
   * Callback fired when the button is pressed.
   */
  onPress: () => void;

  /**
   * Optional style overrides for the button container.
   */
  style?: ViewStyle;
}
