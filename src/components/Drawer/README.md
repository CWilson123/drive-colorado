# Drawer

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/AboutModal/README.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: drawer, navigation, menu, slide-in
#end-metadata

## Purpose
Slide-in navigation menu from left with app navigation, branding, and attribution. Features Colorado flag inspired design.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, z-index
  - `./Drawer.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, StyleSheet, Animated, TouchableOpacity
  - `react-native-safe-area-context` - Safe area insets
  - `expo-linear-gradient` - LinearGradient for decoration
  - `@expo/vector-icons` - Feather icons

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether drawer is visible |
| `onClose` | `() => void` | Yes | - | Callback when drawer should close |
| `onAboutPress` | `() => void` | No | - | Callback when About is pressed |
| `onSettingsPress` | `() => void` | No | - | Callback when Settings is pressed |
| `onFeedbackPress` | `() => void` | No | - | Callback when Send Feedback is pressed |

### Menu Items

| ID | Label | Icon | Status |
|----|-------|------|--------|
| `about` | About | `info` | Active |
| `settings` | Settings | `settings` | Active |
| `feedback` | Send Feedback | `message-circle` | Active |
| `ski-planner` | Ski Trip Planner | `home` | Coming Soon |
| `favorites` | Favorite Locations | `star` | Coming Soon |

## Usage Example

```typescript
import { Drawer } from '@/components';

<Drawer
  visible={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  onAboutPress={() => {
    setIsDrawerOpen(false);
    setIsAboutModalOpen(true);
  }}
  onSettingsPress={openSettings}
  onFeedbackPress={openFeedback}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses Drawer
- [src/components/AboutModal/README.md](../AboutModal/README.md) - Opened via About menu item
- [src/constants/colors.md](../../constants/colors.md) - Colorado flag colors

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only handles navigation menu UI
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Animated slide-in from left (300ms duration)
- Touch outside overlay to dismiss
- Colorado flag decoration element (red C with gold circle)
- Drawer width: 280px
- Disabled items show "Coming Soon" badge
- LinearGradient for visual appeal
