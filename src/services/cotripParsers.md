# COtrip Parsers

#metadata
- type: service
- related: src/hooks/useMapLayers.md, src/services/cotripApi.md, src/types/cotrip.md, src/constants/colors.md
- last_updated: 2026-02-02
- tags: parser, transformation, geojson, validation
#end-metadata

## Purpose
Transform raw COtrip API data into map-ready formats (MapMarkerData and MapOverlayData). Includes coordinate validation and error handling.

## Dependencies
- **Internal**:
  - `@/types` - TypeScript type definitions
  - `@/constants` - Colors
- **External**:
  - None

## Parser Functions

| Function | Input | Output | Description |
|----------|--------|--------|-------------|
| `parseRoadConditionsToOverlays()` | `RoadCondition[]` | `MapOverlayData[]` | Transforms road conditions to line overlays |
| `parseIncidentsToMarkers()` | `Incident[]` | `MapMarkerData[]` | Transforms incidents to point markers |
| `parseWeatherStationsToMarkers()` | `WeatherStation[]` | `MapMarkerData[]` | Transforms weather stations to point markers |
| `parseSnowPlowsToMarkers()` | `SnowPlow[]` | `MapMarkerData[]` | Transforms snow plows to point markers |
| `parsePlannedEventsToMarkers()` | `PlannedEvent[]` | `MapMarkerData[]` | Transforms planned events to point markers |
| `parseDmsSignsToMarkers()` | `DmsSign[]` | `MapMarkerData[]` | Transforms DMS signs to point markers |
| `parseWorkZonesToOverlays()` | `WorkZone[]` | `MapOverlayData[]` | Transforms work zones to line overlays |

## Helper Functions

### isValidCoordinate

Validates that coordinates are valid numbers within geographic bounds.

**Signature:** `(coord: [number, number] \| undefined \| null) => boolean`

**Validation Rules:**
- Must be an array with 2 elements
- Both elements must be numbers (not NaN)
- Longitude must be between -180 and 180
- Latitude must be between -90 and 90

## Color Mappings

| Data Type | Color | Constant |
|-----------|-------|----------|
| Road conditions | Blue | `CO_BLUE` |
| Work zones | Orange/Amber | `#F59E0B` |
| Snow plows | Gold | `CO_GOLD` |

## Usage Example

```typescript
import {
  parseRoadConditionsToOverlays,
  parseIncidentsToMarkers,
} from '@/services/cotripParsers';

const rawData = await fetchAllLayerData();

// Transform to map-ready formats
const overlays = parseRoadConditionsToOverlays(rawData.roadConditions);
const markers = parseIncidentsToMarkers(rawData.incidents);
```

## Related Files
- [src/services/cotripApi.md](cotripApi.md) - Fetches raw data
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Uses parser functions
- [src/types/cotrip.md](../types/cotrip.md) - Type definitions

## Design Principles Applied
- **Error resilience**: All functions handle errors gracefully
- **Coordinate validation**: Filters invalid coordinates to prevent map crashes
- **Type safety**: Explicit TypeScript input/output types
- **No throwing**: Functions never throw, always return arrays

## Implementation Notes
- **Road Conditions**: GeoJSON LineString features, filtered by ID and valid coordinates
- **Incidents**: GeoJSON MultiPoint features, extracts first coordinate
- **Weather Stations**: GeoJSON Point features
- **Snow Plows**: Custom AVL structure (not GeoJSON), extracts coordinates from `avl_location`
- **Planned Events**: GeoJSON MultiPoint features, extracts first coordinate
- **DMS Signs**: GeoJSON Point features
- **Work Zones**: WZDx format with `core_details.geometry.coordinates`
- All parsers warn to console when skipping invalid data
- Returns empty array if no valid data found
