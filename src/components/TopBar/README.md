# TopBar

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/Drawer/README.md, src/components/LayerDropdown/README.md, src/constants/colors.md, src/constants/layout.md
- last_updated: 2026-02-02
- tags: navigation, header, ui, layout
#end-metadata

## Purpose
Top navigation bar with menu, search, and layer controls. Positioned at top with safe area padding.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, border radius
  - `./TopBar.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, TextInput, TouchableOpacity, StyleSheet
  - `react-native-safe-area-context` - Safe area insets
  - `@expo/vector-icons` - Feather icons

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onMenuPress` | `() => void` | Yes | - | Callback when menu button pressed |
| `onLayerPress` | `() => void` | Yes | - | Callback when layer button pressed |
| `onSearchChange` | `(text: string) => void` | No | - | Callback when search input changes |
| `onSearchSubmit` | `(text: string) => void` | No | - | Callback when search submitted |
| `searchValue` | `string` | No | - | Current search input value |
| `style` | `ViewStyle` | No | - | Optional style overrides |

## Usage Example

```typescript
import { TopBar } from '@/components';

<TopBar
  onMenuPress={() => setDrawerOpen(true)}
  onLayerPress={() => setLayerDropdownOpen(true)}
  onSearchChange={setSearchQuery}
  onSearchSubmit={handleSearch}
  searchValue={searchQuery}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses TopBar
- [src/components/Drawer/README.md](../Drawer/README.md) - Opened via menu button
- [src/components/LayerDropdown/README.md](../LayerDropdown/README.md) - Opened via layer button

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only handles top bar UI and callbacks
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Uses `useSafeAreaInsets` for proper iOS notch handling
- Icon size: 24px, Button size: 44px (touch target minimum)
- Search input uses Feather icons for visual feedback
- Controlled/uncontrolled search input support
