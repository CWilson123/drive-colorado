# LoadingOverlay

#metadata
- type: component
- related: src/screens/HomeScreen.md
- last_updated: 2026-02-02
- tags: loading, overlay, spinner, animation
#end-metadata

## Purpose
Semi-transparent overlay with loading spinner and optional message. Positioned below TopBar, above map.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, z-index
  - `./LoadingOverlay.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, StyleSheet, Animated, ActivityIndicator

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether overlay is visible |
| `message` | `string` | No | `'Loading map data...'` | Optional message to display below spinner |

## Usage Example

```typescript
import { LoadingOverlay } from '@/components';

<LoadingOverlay
  visible={isLoading}
  message="Loading road conditions..."
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses LoadingOverlay

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only displays loading state
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Fade animation (200ms duration)
- Uses native driver for performance
- Returns null when not visible and animation complete
- Large ActivityIndicator in blue color
- Positioned above map but below TopBar
- pointerEvents controlled by visible state
