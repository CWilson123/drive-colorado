/**
 * Type definitions for the ErrorToast component.
 */

/**
 * Props for the ErrorToast component.
 */
export interface ErrorToastProps {
  /**
   * Whether the toast is visible.
   */
  visible: boolean;

  /**
   * Error message to display.
   */
  message: string;

  /**
   * Callback fired when the toast is tapped (for retry action).
   */
  onPress?: () => void;

  /**
   * Callback fired when the toast auto-dismisses.
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss duration in milliseconds.
   * @default 5000
   */
  duration?: number;
}
