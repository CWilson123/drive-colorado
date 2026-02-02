# MyLocationButton

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/Map/README.md, src/constants/layout.md
- last_updated: 2026-02-02
- tags: button, location, floating, map-controls
#end-metadata

## Purpose
Floating button to center map on user's location. Positioned on right side above bottom info bar.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, layout values
  - `./MyLocationButton.types` - TypeScript interfaces
- **External**:
  - `react-native` - TouchableOpacity, StyleSheet
  - `react-native-safe-area-context` - Safe area insets
  - `@expo/vector-icons` - Feather icons

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onPress` | `() => void` | Yes | - | Callback when button is pressed |
| `style` | `ViewStyle` | No | - | Optional style overrides |

## Usage Example

```typescript
import { MyLocationButton } from '@/components';

<MyLocationButton
  onPress={() => setCenterOnUserTrigger(prev => prev + 1)}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses MyLocationButton
- [src/components/Map/README.md](../Map/README.md) - Receives centerOnUserTrigger

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only handles location centering button
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Positioned absolute on right side
- Bottom offset: safe area + spacing + bottom bar height
- Icon: crosshair from Feather icons
- Shadow effect for elevation
- Touch target: 44px minimum
