# Layout Constants

#metadata
- type: constants
- related: src/components/BottomInfoBar/README.md, src/components/MyLocationButton/README.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: layout, sizing, shadows, elevation
#end-metadata

## Purpose
Component-specific layout dimensions, shadows, and elevation values for UI components.

## Bottom Info Bar Constants

| Constant | Value | Description |
|-----------|--------|-------------|
| `BOTTOM_INFO_BAR_HEIGHT` | `64` | Bar container height |
| `BOTTOM_INFO_BAR_STATUS_DOT_SIZE` | `12` | Status indicator dot size |
| `BOTTOM_INFO_BAR_TITLE_MARGIN_BOTTOM` | `2` | Title bottom margin |
| `BOTTOM_INFO_BAR_SHADOW_OFFSET` | `{ width: 0, height: 2 }` | Shadow offset |
| `BOTTOM_INFO_BAR_SHADOW_OPACITY` | `0.15` | Shadow opacity |
| `BOTTOM_INFO_BAR_SHADOW_RADIUS` | `4` | Shadow blur radius |
| `BOTTOM_INFO_BAR_ELEVATION` | `4` | Android elevation |

## My Location Button Constants

| Constant | Value | Description |
|-----------|--------|-------------|
| `MY_LOCATION_BUTTON_SIZE` | `48` | Button width and height |
| `MY_LOCATION_ICON_SIZE` | `24` | Icon size |
| `MY_LOCATION_BUTTON_BOTTOM_OFFSET` | `12` | Bottom offset from safe area |
| `MY_LOCATION_BUTTON_SHADOW_OFFSET` | `{ width: 0, height: 2 }` | Shadow offset |
| `MY_LOCATION_BUTTON_SHADOW_OPACITY` | `0.15` | Shadow opacity |
| `MY_LOCATION_BUTTON_SHADOW_RADIUS` | `4` | Shadow blur radius |
| `MY_LOCATION_BUTTON_ELEVATION` | `4` | Android elevation |

## Usage Example

```typescript
import {
  BOTTOM_INFO_BAR_HEIGHT,
  MY_LOCATION_BUTTON_SIZE,
} from '@/constants';

<View style={{ height: BOTTOM_INFO_BAR_HEIGHT }} />
<View style={{ width: MY_LOCATION_BUTTON_SIZE, height: MY_LOCATION_BUTTON_SIZE }} />
```

## Related Files
- [src/components/BottomInfoBar/README.md](../components/BottomInfoBar/README.md) - Uses bottom bar constants
- [src/components/MyLocationButton/README.md](../components/MyLocationButton/README.md) - Uses button constants
- [src/constants/colors.md](colors.md) - Color constants

## Design Principles Applied
- **Centralized sizing**: All layout values in one file
- **No magic numbers**: Component dimensions named and documented
- **Platform awareness**: Elevation values for Android

## Implementation Notes
- Bottom bar positioned with safe area padding
- My Location button positioned absolute on right side
- Shadow/elevation provide depth perception
- Values sized for touch targets (48px minimum)
