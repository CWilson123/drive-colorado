/**
 * Colorado flag inspired color palette and theme constants.
 * All colors should be referenced from this file - never hardcode hex values in components.
 */

// Primary Colors - Colorado Blue
export const CO_BLUE = '#002868';
export const CO_BLUE_LIGHT = '#1a4a8a';

// Accent Colors - Colorado Red
export const CO_RED = '#BF0A30';
export const CO_RED_LIGHT = '#d4213f';

// Highlight Colors - Colorado Gold
export const CO_GOLD = '#FFD700';
export const CO_GOLD_MUTED = '#F4C430';

// Neutral Colors
export const CO_WHITE = '#FFFFFF';
export const CO_GRAY_LIGHT = '#F5F5F5';
export const CO_GRAY = '#E0E0E0';
export const CO_GRAY_DARK = '#666666';

// Semantic Colors (mapped to Colorado palette)
export const COLOR_PRIMARY = CO_BLUE;
export const COLOR_PRIMARY_HOVER = CO_BLUE_LIGHT;
export const COLOR_ACCENT = CO_RED;
export const COLOR_ACCENT_HOVER = CO_RED_LIGHT;
export const COLOR_WARNING = CO_GOLD;
export const COLOR_WARNING_MUTED = CO_GOLD_MUTED;
export const COLOR_SUCCESS = '#10B981';
export const COLOR_ERROR = CO_RED;
export const COLOR_BACKGROUND = CO_GRAY_LIGHT;
export const COLOR_SURFACE = CO_WHITE;
export const COLOR_TEXT_PRIMARY = CO_BLUE;
export const COLOR_TEXT_SECONDARY = CO_GRAY_DARK;
export const COLOR_BORDER = CO_GRAY;

// Shadow Styles
export const SHADOW_SM = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
export const SHADOW_MD = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
export const SHADOW_LG = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
export const SHADOW_XL = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

// Border Radius
export const BORDER_RADIUS_SM = 4;
export const BORDER_RADIUS_MD = 8;
export const BORDER_RADIUS_LG = 12;
export const BORDER_RADIUS_FULL = 9999;

// Spacing (in pixels)
export const SPACING_XS = 4;
export const SPACING_SM = 8;
export const SPACING_MD = 16;
export const SPACING_LG = 24;
export const SPACING_XL = 32;
export const SPACING_XXL = 48;

// Typography
export const FONT_SIZE_XS = 12;
export const FONT_SIZE_SM = 14;
export const FONT_SIZE_MD = 16;
export const FONT_SIZE_LG = 18;
export const FONT_SIZE_XL = 20;
export const FONT_SIZE_XXL = 24;
export const FONT_SIZE_HEADING = 32;

export const FONT_WEIGHT_NORMAL = '400';
export const FONT_WEIGHT_MEDIUM = '500';
export const FONT_WEIGHT_SEMIBOLD = '600';
export const FONT_WEIGHT_BOLD = '700';

// Opacity
export const OPACITY_DISABLED = 0.5;
export const OPACITY_HOVER = 0.8;
export const OPACITY_OVERLAY = 0.7;

// Z-Index layers
export const Z_INDEX_BASE = 0;
export const Z_INDEX_DROPDOWN = 100;
export const Z_INDEX_STICKY = 200;
export const Z_INDEX_MODAL = 300;
export const Z_INDEX_TOOLTIP = 400;
