/**
 * Type definitions for the Drawer component.
 */

/**
 * Props for the Drawer component.
 */
export interface DrawerProps {
  /**
   * Whether the drawer is visible.
   */
  visible: boolean;

  /**
   * Callback fired when the drawer should close.
   */
  onClose: () => void;

  /**
   * Callback fired when About is pressed.
   */
  onAboutPress?: () => void;

  /**
   * Callback fired when Settings is pressed.
   */
  onSettingsPress?: () => void;

  /**
   * Callback fired when Send Feedback is pressed.
   */
  onFeedbackPress?: () => void;
}

/**
 * Menu item configuration.
 */
export interface MenuItem {
  /**
   * Unique identifier for the menu item.
   */
  id: string;

  /**
   * Display label for the menu item.
   */
  label: string;

  /**
   * Feather icon name.
   */
  icon: string;

  /**
   * Whether the item is disabled (coming soon).
   */
  disabled?: boolean;

  /**
   * Badge text to display (e.g., "Coming Soon").
   */
  badge?: string;
}
