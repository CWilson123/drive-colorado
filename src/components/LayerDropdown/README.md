# LayerDropdown

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/constants/layerIcons.md, src/hooks/useMapLayers.md
- last_updated: 2026-02-02
- tags: dropdown, layers, toggle, map-controls
#end-metadata

## Purpose
Dropdown panel for toggling map layers. Displays all available layers with toggle switches, loading state, and last updated time.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, layer icons
  - `./LayerDropdown.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, Switch, Animated, StyleSheet
  - `react-native-safe-area-context` - Safe area insets

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether dropdown is visible |
| `onClose` | `() => void` | Yes | - | Callback when dropdown should close |
| `enabledLayers` | `Record<string, boolean>` | Yes | - | Record of enabled layer states |
| `onToggleLayer` | `(id: string) => void` | Yes | - | Callback when layer toggle is pressed |
| `isLoading` | `boolean` | No | `false` | Whether layer data is currently loading |
| `lastUpdated` | `Date \| null` | No | `null` | Timestamp of last data update |

### Available Layers

| Layer ID | Name | Default Enabled |
|----------|------|----------------|
| `roadConditions` | Road Conditions | Yes |
| `incidents` | Traffic Incidents | Yes |
| `workZones` | Work Zones | No |
| `plannedEvents` | Planned Events | No |
| `weatherStations` | Weather Stations | No |
| `snowPlows` | Snow Plows | No |
| `dmsSigns` | Message Signs | No |

## Usage Example

```typescript
import { LayerDropdown } from '@/components';

<LayerDropdown
  visible={isLayerDropdownOpen}
  onClose={() => setIsLayerDropdownOpen(false)}
  enabledLayers={enabledLayers}
  onToggleLayer={toggleLayer}
  isLoading={isLoading}
  lastUpdated={lastUpdated}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses LayerDropdown
- [src/hooks/useMapLayers.md](../../hooks/useMapLayers.md) - Provides enabledLayers and toggleLayer
- [src/constants/layerIcons.md](../../constants/layerIcons.md) - Layer icon configurations

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only handles layer toggle UI
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Animated fade/scale on open/close (200ms duration)
- Touch outside to dismiss
- Shows loading indicator when `isLoading` is true
- Displays relative time for last update (e.g., "Updated 2 min ago")
- Icon size: 36px per layer item
