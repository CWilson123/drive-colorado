# MarkerDetailSheet

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/BottomInfoBar/README.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: bottom-sheet, details, swipe, map-interaction
#end-metadata

## Purpose
Bottom sheet displaying detailed marker/overlay information. Slides up from bottom when map feature is tapped. Supports swipe-to-dismiss.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, layer icons
  - `./MarkerDetailSheet.types` - TypeScript interfaces
  - `@/types` - Incident, WeatherStation, SnowPlow, PlannedEvent, DmsSign, WorkZone
- **External**:
  - `react-native` - View, Text, StyleSheet, Animated, ScrollView
  - `react-native-safe-area-context` - Safe area insets
  - `react-native-gesture-handler` - PanGestureHandler

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether sheet is visible |
| `marker` | `MapMarkerData \| null` | Yes | - | Marker data to display (for point markers) |
| `overlay` | `MapOverlayData \| null` | Yes | - | Overlay data to display (for road condition lines) |
| `onClose` | `() => void` | Yes | - | Callback when sheet should close |

### Severity Levels (for incidents)

| Severity | Color |
|----------|--------|
| `minor` | Green (COLOR_SUCCESS) |
| `moderate` | Gold (CO_GOLD) |
| `major` | Red (CO_RED) |

### Road Condition Types

| Type | Color |
|------|-------|
| `Dry` | Green (COLOR_SUCCESS) |
| `Wet` | Gold (CO_GOLD) |
| `Icy` | Blue (CO_BLUE) |
| `Snow Packed` | Blue (CO_BLUE) |
| `Closed` | Red (CO_RED) |
| `Unknown` | Gray (CO_GRAY) |

## Usage Example

```typescript
import { MarkerDetailSheet } from '@/components';

<MarkerDetailSheet
  visible={!!selectedMarker || !!selectedOverlay}
  marker={selectedMarker}
  overlay={selectedOverlay}
  onClose={() => {
    setSelectedMarker(null);
    setSelectedOverlay(null);
  }}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses MarkerDetailSheet
- [src/components/BottomInfoBar/README.md](../BottomInfoBar/README.md) - Opens sheet on press
- [src/components/Map/README.md](../Map/README.md) - Provides marker/overlay data

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only displays feature details
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Sheet height: 70% of screen
- Swipe to dismiss (downward drag or velocity)
- Drag handle visual feedback
- Different layouts for marker types (incident, weather station, snow plow, etc.)
- Road conditions show condition type and color badge
- Work zone color: orange (#F59E0B)
- Gesture handler for swipe detection
