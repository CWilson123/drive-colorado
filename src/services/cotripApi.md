# COtrip API

#metadata
- type: service
- related: src/hooks/useMapLayers.md, src/services/cotripParsers.md, src/constants/api.md, src/types/cotrip.md
- last_updated: 2026-02-02
- tags: api, fetch, cotrip, data-fetching
#end-metadata

## Purpose
Async functions to fetch data from COtrip.org API. Includes error handling, timeouts, and graceful degradation.

## Dependencies
- **Internal**:
  - `@/constants` - API configuration (base URL, endpoints, key)
  - `@/types` - TypeScript type definitions
- **External**:
  - Native `fetch` API - HTTP requests
  - `AbortController` - Request timeout handling

## Configuration

| Constant | Value | Description |
|----------|--------|-------------|
| `REQUEST_TIMEOUT` | `15000` | Request timeout in milliseconds (15 seconds) |

## API Functions

| Function | Return Type | Description |
|----------|-------------|-------------|
| `fetchRoadConditions()` | `Promise<RoadCondition[]>` | Fetches road condition segments |
| `fetchIncidents()` | `Promise<Incident[]>` | Fetches traffic incidents |
| `fetchWeatherStations()` | `Promise<WeatherStation[]>` | Fetches weather station data |
| `fetchSnowPlows()` | `Promise<SnowPlow[]>` | Fetches live snow plow tracking |
| `fetchPlannedEvents()` | `Promise<PlannedEvent[]>` | Fetches planned road events |
| `fetchDmsSigns()` | `Promise<DmsSign[]>` | Fetches Dynamic Message Signs |
| `fetchWorkZones()` | `Promise<WorkZone[]>` | Fetches work zone data (WZDx format) |
| `fetchAllLayerData()` | `Promise<LayerDataResult>` | Fetches all layers in parallel |

### fetchAllLayerData Return Type

```typescript
export interface LayerDataResult {
  roadConditions: RoadCondition[];
  incidents: Incident[];
  weatherStations: WeatherStation[];
  snowPlows: SnowPlow[];
  plannedEvents: PlannedEvent[];
  dmsSigns: DmsSign[];
  workZones: WorkZone[];
}
```

## Usage Example

```typescript
import {
  fetchAllLayerData,
  fetchRoadConditions,
} from '@/services/cotripApi';

// Fetch all layers at once
const data = await fetchAllLayerData();

// Fetch single layer
const conditions = await fetchRoadConditions();
```

## Related Files
- [src/services/cotripParsers.md](cotripParsers.md) - Transforms raw data to map formats
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Uses fetchAllLayerData
- [src/constants/api.md](../constants/api.md) - API configuration
- [src/types/cotrip.md](../types/cotrip.md) - Type definitions

## Design Principles Applied
- **Error resilience**: All functions return empty arrays on failure
- **Timeout handling**: 15-second timeout on all requests
- **No throwing**: Functions never throw, always return data
- **Parallel fetching**: fetchAllLayerData uses Promise.all for performance

## Implementation Notes
- Uses native `fetch` API
- AbortController for timeout handling
- Each function logs errors to console
- Returns `data.features || []` for GeoJSON endpoints
- Snow plows have custom structure (not standard GeoJSON)
- fetchAllLayerData catches all errors and returns empty arrays
- Parallel fetching reduces total load time
