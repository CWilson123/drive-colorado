/**
 * Type definitions for the BottomInfoBar component.
 */

import type { ViewStyle } from 'react-native';

/**
 * Status level for road conditions.
 */
export type StatusLevel = 'good' | 'warning' | 'severe';

/**
 * Props for the BottomInfoBar component.
 */
export interface BottomInfoBarProps {
  /**
   * Whether the info bar is visible.
   */
  visible: boolean;

  /**
   * Status level determining the indicator color.
   */
  status: StatusLevel;

  /**
   * Primary title text (e.g., road name).
   */
  title: string;

  /**
   * Secondary subtitle text (e.g., condition description).
   */
  subtitle: string;

  /**
   * Optional callback when the bar is pressed.
   */
  onPress?: () => void;

  /**
   * Optional style overrides for the container.
   */
  style?: ViewStyle;
}
