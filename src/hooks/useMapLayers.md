# useMapLayers

#metadata
- type: hook
- related: src/screens/HomeScreen.md, src/services/cotripApi.md, src/services/cotripParsers.md, src/types/cotrip.md
- last_updated: 2026-02-02
- tags: hook, map-layers, caching, auto-refresh
#end-metadata

## Purpose
Custom hook for managing map layer data. Handles fetching, caching, filtering, and auto-refresh of COtrip data layers.

## Dependencies
- **Internal**:
  - `@/types` - MapOverlayData, MapMarkerData types
  - `@/services` - fetchAllLayerData and parser functions
  - `@/constants` - CACHE_TTL
- **External**:
  - `react` - useState, useEffect, useCallback, useRef, useMemo
  - `react-native` - AppState for app state awareness

## API

### Return Type

```typescript
export interface UseMapLayersResult {
  overlays: MapOverlayData[];
  markers: MapMarkerData[];
  enabledLayers: Record<LayerType, boolean>;
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  toggleLayer: (id: LayerType) => void;
  refreshData: () => Promise<void>;
}
```

| Property | Type | Description |
|----------|-------|-------------|
| `overlays` | `MapOverlayData[]` | Filtered overlay data based on enabled layers |
| `markers` | `MapMarkerData[]` | Filtered marker data based on enabled layers |
| `enabledLayers` | `Record<LayerType, boolean>` | Which layers are currently enabled |
| `isLoading` | `boolean` | Whether data is currently loading |
| `lastUpdated` | `Date \| null` | Timestamp of last successful data update |
| `error` | `string \| null` | Error message if fetch failed |
| `toggleLayer` | `(id: LayerType) => void` | Toggle a layer on/off |
| `refreshData` | `() => Promise<void>` | Manually trigger data refresh |

### Layer Types

```typescript
export type LayerType =
  | 'roadConditions'
  | 'incidents'
  | 'weatherStations'
  | 'snowPlows'
  | 'plannedEvents'
  | 'dmsSigns'
  | 'workZones';
```

## Default Layer States

| Layer | Default Enabled |
|-------|----------------|
| `roadConditions` | Yes |
| `incidents` | Yes |
| `workZones` | No |
| `plannedEvents` | No |
| `weatherStations` | No |
| `snowPlows` | No |
| `dmsSigns` | No |

## Usage Example

```typescript
import { useMapLayers } from '@/hooks/useMapLayers';

function HomeScreen() {
  const {
    overlays,
    markers,
    enabledLayers,
    isLoading,
    lastUpdated,
    error,
    toggleLayer,
    refreshData,
  } = useMapLayers();

  return (
    <>
      <MapView overlays={overlays} markers={markers} />
      <LayerDropdown
        enabledLayers={enabledLayers}
        onToggleLayer={toggleLayer}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />
    </>
  );
}
```

## Related Files
- [src/screens/HomeScreen.md](../screens/HomeScreen.md) - Uses useMapLayers hook
- [src/services/cotripApi.md](../services/cotripApi.md) - Data fetching functions
- [src/services/cotripParsers.md](../services/cotripParsers.md) - Data transformation functions
- [src/types/cotrip.md](../types/cotrip.md) - Type definitions

## Design Principles Applied
- **State encapsulation**: Complex layer management hidden in hook
- **Callback stability**: useCallback for stable function references
- **Memoization**: useMemo for expensive computations
- **App state awareness**: Pauses refresh when app is backgrounded
- **Error resilience**: Handles API failures gracefully

## Implementation Notes
- Initial fetch on mount
- Auto-refresh every CACHE_TTL (5 minutes) when app is foregrounded
- Layer toggle is instant (uses cached data, doesn't refetch)
- Manual refresh via refreshData()
- Caches raw API data to prevent unnecessary fetches
- Filters markers/overlays based on enabledLayers state
- AppState change listener for background/foreground handling
- Error state preserved until next successful fetch
