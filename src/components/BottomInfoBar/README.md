# BottomInfoBar

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/MarkerDetailSheet/README.md, src/constants/colors.md, src/constants/layout.md
- last_updated: 2026-02-02
- tags: info-bar, status, ui, layout
#end-metadata

## Purpose
Status bar for displaying selected road/feature information with status indicator.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, layout values
  - `./BottomInfoBar.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, TouchableOpacity, StyleSheet
  - `react-native-safe-area-context` - Safe area insets

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether info bar is visible |
| `status` | `'good' \| 'warning' \| 'severe'` | Yes | - | Status level determining indicator color |
| `title` | `string` | Yes | - | Primary title text (e.g., road name) |
| `subtitle` | `string` | Yes | - | Secondary subtitle text (e.g., condition description) |
| `onPress` | `() => void` | No | - | Optional callback when bar is pressed |
| `style` | `ViewStyle` | No | - | Optional style overrides |

### Status Levels

| Status | Color | Usage |
|--------|-------|-------|
| `good` | Green (COLOR_SUCCESS) | Clear roads, normal conditions |
| `warning` | Gold (CO_GOLD) | Caution, moderate conditions |
| `severe` | Red (CO_RED) | Road closed, severe conditions |

## Usage Example

```typescript
import { BottomInfoBar, type StatusLevel } from '@/components';

<BottomInfoBar
  visible={!!selectedFeature}
  status={selectedFeature.status}
  title={selectedFeature.title}
  subtitle={selectedFeature.description}
  onPress={() => showDetailSheet(selectedFeature)}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses BottomInfoBar
- [src/components/MarkerDetailSheet/README.md](../MarkerDetailSheet/README.md) - Opens on bar press
- [src/constants/colors.md](../../constants/colors.md) - Status color constants

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only displays status info
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Returns null when `visible` is false
- TouchableOpacity wrapper only when `onPress` provided
- Status dot size from constants
- Shadow effect for elevation
- Safe area handling for bottom spacing
