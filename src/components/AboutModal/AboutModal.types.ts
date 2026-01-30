/**
 * Type definitions for the AboutModal component.
 */

/**
 * Props for the AboutModal component.
 */
export interface AboutModalProps {
  /**
   * Whether the modal is visible.
   */
  visible: boolean;

  /**
   * Callback fired when the modal should close.
   */
  onClose: () => void;
}
