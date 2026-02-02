# ErrorToast

#metadata
- type: component
- related: src/screens/HomeScreen.md
- last_updated: 2026-02-02
- tags: toast, error, notification, animation
#end-metadata

## Purpose
Small toast notification for errors. Slides up from bottom, auto-dismisses after 5 seconds, or tap to retry.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, z-index, layout
  - `./ErrorToast.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, StyleSheet, Animated, TouchableOpacity

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether toast is visible |
| `message` | `string` | Yes | - | Error message to display |
| `onPress` | `() => void` | No | - | Callback when toast is tapped (for retry) |
| `onDismiss` | `() => void` | No | - | Callback when toast auto-dismisses |
| `duration` | `number` | No | `5000` | Auto-dismiss duration in milliseconds |

## Usage Example

```typescript
import { ErrorToast } from '@/components';

<ErrorToast
  visible={showError}
  message="Failed to load data"
  onPress={retryFetch}
  onDismiss={() => setShowError(false)}
  duration={5000}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses ErrorToast

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only displays error notifications
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Animation: slide up and fade in (300ms)
- Auto-dismiss timeout (default 5 seconds)
- Red background with white text
- Positioned above bottom info bar
- Touch outside does not dismiss (must tap toast or timeout)
- Cleanup timeout on unmount
