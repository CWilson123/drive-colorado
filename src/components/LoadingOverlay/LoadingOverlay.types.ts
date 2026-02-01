/**
 * Type definitions for the LoadingOverlay component.
 */

/**
 * Props for the LoadingOverlay component.
 */
export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible.
   */
  visible: boolean;

  /**
   * Optional message to display below the spinner.
   */
  message?: string;
}
