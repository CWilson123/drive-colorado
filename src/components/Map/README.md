# MapView

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/MyLocationButton/README.md, src/constants/map.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: map, MapLibre, location, overlays
#end-metadata

## Purpose
Full-screen MapLibre map displaying Colorado with user location tracking. Handles map rendering, overlays, markers, and location permissions.

## Dependencies
- **Internal**:
  - `@/constants` - Map configuration, colors, marker icons
  - `./MapView.types` - TypeScript interfaces
  - `@/types` - MapMarkerData, MapOverlayData, DmsSign types
- **External**:
  - `@maplibre/maplibre-react-native` - MapView, Camera, ShapeSource, layers
  - `expo-location` - Location permissions and position tracking
  - `react-native` - StyleSheet, Alert, Platform

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `style` | `ViewStyle` | No | - | Optional style overrides for map container |
| `onMapReady` | `() => void` | No | - | Callback when map is fully loaded |
| `onMapError` | `(error: Error) => void` | No | - | Callback when map fails to load |
| `centerOnUserTrigger` | `number` | No | `0` | Trigger to center on user location (increment to re-center) |
| `overlays` | `MapOverlayData[]` | Yes | - | Road condition and work zone overlay data |
| `markers` | `MapMarkerData[]` | Yes | - | Marker data (incidents, weather stations, snow plows) |
| `onMarkerPress` | `(marker: MapMarkerData) => void` | No | - | Callback when marker is tapped |
| `onOverlayPress` | `(overlay: MapOverlayData) => void` | No | - | Callback when overlay is tapped |

### Rendering Layers

| Layer | Type | Component | Description |
|-------|------|-----------|-------------|
| Base map | Vector tiles | MapLibre | OpenFreeMap Liberty style |
| Overlays | LineString | LineLayer | Road conditions (blue), work zones (orange) |
| Markers | Points | SymbolLayer | Layer-specific PNG icons |
| User location | Point | UserLocation | Blue dot with heading indicator |

## Usage Example

```typescript
import { MapView } from '@/components';
import { MapMarkerData, MapOverlayData } from '@/types';

<MapView
  overlays={overlays}
  markers={markers}
  onMapReady={() => console.log('Map ready')}
  onMapError={(err) => console.error(err)}
  onMarkerPress={(marker) => showMarkerDetail(marker)}
  onOverlayPress={(overlay) => showOverlayDetail(overlay)}
  centerOnUserTrigger={userTriggerCount}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses MapView component
- [src/components/MyLocationButton/README.md](../MyLocationButton/README.md) - Triggers centerOnUserTrigger
- [src/constants/map.md](../../constants/map.md) - Map center, zoom, bounds
- [src/constants/colors.md](../../constants/colors.md) - Layer colors
- [src/constants/mapIcons.md](../../constants/mapIcons.md) - Marker icon images

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Type safety**: Explicit TypeScript props from `.types.ts`
- **Memoization**: useMemo for GeoJSON transformations
- **Error resilience**: Handles location permission denial gracefully
- **Single-purpose**: Only handles map rendering and user location

## Implementation Notes
- MapLibre GL rendering (native performance, no marker drift)
- Location permissions requested on mount
- Initial center on user location (once), then stays put
- DMS signs dimmed when `displayStatus === 'off'`
- Work zones rendered in orange (#F59E0B)
- Overlays rendered as LineLayer, markers as SymbolLayer
- SymbolLayer uses PNG icons from constants
- React.memo wrapper for performance
