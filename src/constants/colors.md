# Colors and Theme

#metadata
- type: constants
- related: src/components/README.md, src/constants/map.md
- last_updated: 2026-02-02
- tags: colors, theme, spacing, typography
#end-metadata

## Purpose
Colorado flag-inspired color palette and theme constants. All visual styling values centralized here.

## Colorado Flag Colors

| Constant | Hex | Usage |
|----------|------|-------|
| `CO_BLUE` | `#002868` | Primary blue, text, icons |
| `CO_BLUE_LIGHT` | `#1a4a8a` | Blue hover state |
| `CO_RED` | `#BF0A30` | Accent red, errors |
| `CO_RED_LIGHT` | `#d4213f` | Red hover state |
| `CO_GOLD` | `#FFD700` | Gold highlight, warnings |
| `CO_GOLD_MUTED` | `#F4C430` | Muted gold warning |
| `CO_WHITE` | `#FFFFFF` | Surfaces, text |
| `CO_BLACK` | `#000000` | Text, borders |
| `CO_GRAY_LIGHT` | `#F5F5F5` | Backgrounds |
| `CO_GRAY` | `#E0E0E0` | Borders, dividers |
| `CO_GRAY_DARK` | `#666666` | Secondary text |

## Semantic Colors

| Constant | Value | Usage |
|----------|-------|-------|
| `COLOR_PRIMARY` | `CO_BLUE` | Primary actions, branding |
| `COLOR_PRIMARY_HOVER` | `CO_BLUE_LIGHT` | Primary hover state |
| `COLOR_ACCENT` | `CO_RED` | Accents, highlights |
| `COLOR_ACCENT_HOVER` | `CO_RED_LIGHT` | Accent hover state |
| `COLOR_WARNING` | `CO_GOLD` | Warnings, caution |
| `COLOR_WARNING_MUTED` | `CO_GOLD_MUTED` | Muted warnings |
| `COLOR_SUCCESS` | `#10B981` | Success states, good conditions |
| `COLOR_ERROR` | `CO_RED` | Error states |
| `COLOR_BACKGROUND` | `CO_GRAY_LIGHT` | Background surfaces |
| `COLOR_SURFACE` | `CO_WHITE` | Card/modal surfaces |
| `COLOR_TEXT_PRIMARY` | `CO_BLUE` | Primary text |
| `COLOR_TEXT_SECONDARY` | `CO_GRAY_DARK` | Secondary text |
| `COLOR_BORDER` | `CO_GRAY` | Borders, dividers |

## Spacing (pixels)

| Constant | Value |
|----------|--------|
| `SPACING_XS` | 4 |
| `SPACING_SM` | 8 |
| `SPACING_MD` | 16 |
| `SPACING_LG` | 24 |
| `SPACING_XL` | 32 |
| `SPACING_XXL` | 48 |

## Typography

| Constant | Value | Usage |
|----------|--------|-------|
| `FONT_SIZE_XS` | 12 | Captions, labels |
| `FONT_SIZE_SM` | 14 | Body text |
| `FONT_SIZE_MD` | 16 | Standard text |
| `FONT_SIZE_LG` | 18 | Subheadings |
| `FONT_SIZE_XL` | 20 | Large text |
| `FONT_SIZE_XXL` | 24 | Extra large text |
| `FONT_SIZE_HEADING` | 32 | Headings |
| `FONT_WEIGHT_NORMAL` | `'400'` | Normal weight |
| `FONT_WEIGHT_MEDIUM` | `'500'` | Medium weight |
| `FONT_WEIGHT_SEMIBOLD` | `'600'` | Semibold weight |
| `FONT_WEIGHT_BOLD` | `'700'` | Bold weight |

## Border Radius (pixels)

| Constant | Value |
|----------|--------|
| `BORDER_RADIUS_SM` | 4 |
| `BORDER_RADIUS_MD` | 8 |
| `BORDER_RADIUS_LG` | 12 |
| `BORDER_RADIUS_FULL` | 9999 |

## Shadows

| Constant | Value |
|----------|--------|
| `SHADOW_SM` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
| `SHADOW_MD` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` |
| `SHADOW_LG` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |
| `SHADOW_XL` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` |

## Opacity

| Constant | Value | Usage |
|----------|--------|-------|
| `OPACITY_DISABLED` | 0.5 | Disabled elements |
| `OPACITY_HOVER` | 0.8 | Hover states |
| `OPACITY_OVERLAY` | 0.7 | Modal/drawer overlays |

## Z-Index Layers

| Constant | Value | Usage |
|----------|--------|-------|
| `Z_INDEX_BASE` | 0 | Base layer |
| `Z_INDEX_DROPDOWN` | 100 | Dropdowns |
| `Z_INDEX_STICKY` | 200 | Sticky elements |
| `Z_INDEX_MODAL` | 300 | Modals, toasts |
| `Z_INDEX_TOOLTIP` | 400 | Tooltips |

## Usage Example

```typescript
import {
  CO_BLUE,
  CO_RED,
  SPACING_MD,
  FONT_SIZE_MD,
  BORDER_RADIUS_LG,
} from '@/constants';

<View
  style={{
    backgroundColor: CO_BLUE,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_LG,
  }}
/>
```

## Related Files
- [src/components/README.md](../components/README.md) - Components use these constants
- [src/constants/map.md](map.md) - Map configuration
- [src/constants/README.md](../constants/README.md) - Constants folder overview

## Design Principles Applied
- **Centralized theming**: All design tokens in one file
- **No hardcoded values**: Never hardcode hex values in components
- **Consistent naming**: SCREAMING_SNAKE_CASE for constants
- **Colorado theme**: Colors derived from state flag

## Implementation Notes
- Colorado flag: Blue (#002868), Red (#BF0A30), Gold (#FFD700), White
- Semantic colors map to Colorado palette
- Spacing scale: 4px base unit (multiples of 4)
- Typography scale matches material design
