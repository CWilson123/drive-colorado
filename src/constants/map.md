# Map Configuration

#metadata
- type: constants
- related: src/components/Map/README.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: map, coordinates, zoom, bounds
#end-metadata

## Purpose
MapLibre map configuration including center point, zoom levels, bounds, and style URL.

## Constants

| Constant | Type | Value | Description |
|-----------|-------|--------|-------------|
| `DEFAULT_MAP_CENTER` | `Coordinates` | `{ lat: 39.7392, lon: -104.9903 }` | Denver, CO coordinates |
| `DEFAULT_ZOOM_LEVEL` | `number` | `7` | Initial zoom level (state-wide view) |
| `COLORADO_BOUNDS` | `BoundingBox` | `{ n: 41.0, s: 37.0, e: -102.0, w: -109.05 }` | Colorado geographic boundaries |
| `MIN_ZOOM` | `number` | `5` | Minimum zoom level |
| `MAX_ZOOM` | `number` | `18` | Maximum zoom level |
| `OPENFREEMAP_LIBERTY_STYLE_URL` | `string` | `https://tiles.openfreemap.org/styles/liberty` | Map tile style URL |

### Type Definitions

```typescript
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}
```

## Colorado Boundaries

| Direction | Coordinate | Border |
|-----------|-------------|---------|
| North | `41.0°N` | Wyoming border |
| South | `37.0°N` | New Mexico/Oklahoma border |
| East | `-102.0°W` | Kansas/Nebraska border |
| West | `-109.05°W` | Utah border |

## Zoom Levels

| Level | Description |
|-------|-------------|
| `5` | Minimum zoom - Colorado and neighboring states |
| `7` | Default - State-wide view with major cities/highways |
| `18` | Maximum - Street-level detail |

## Usage Example

```typescript
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_LEVEL,
  COLORADO_BOUNDS,
  OPENFREEMAP_LIBERTY_STYLE_URL,
} from '@/constants';

<MapView
  styleUrl={OPENFREEMAP_LIBERTY_STYLE_URL}
  centerCoordinate={DEFAULT_MAP_CENTER}
  zoomLevel={DEFAULT_ZOOM_LEVEL}
  bounds={COLORADO_BOUNDS}
/>
```

## Related Files
- [src/components/Map/README.md](../components/Map/README.md) - Uses these constants
- [src/constants/colors.md](colors.md) - Colorado flag colors used in map
- [src/constants/README.md](../constants/README.md) - Constants folder overview

## Design Principles Applied
- **Centralized configuration**: All map settings in one file
- **Type safety**: Explicit TypeScript interfaces for coordinates/bounds
- **No magic numbers**: All values named and documented

## Implementation Notes
- Center set to Denver (state capital, geographic center of metro area)
- Zoom 7 shows entire state with reasonable detail
- Bounds constraint keeps users within Colorado
- OpenFreeMap Liberty provides clean, professional vector tiles
