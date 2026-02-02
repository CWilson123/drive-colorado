# Services

#metadata
- type: folder
- related: src/constants/api.md, src/types/cotrip.md, src/hooks/useMapLayers.md
- last_updated: 2026-02-02
- tags: services, api, data-fetching
#end-metadata

## Purpose
API integrations and data transformation logic. Services handle external API communication and convert raw data into map-ready formats.

## Dependencies
- **Internal**:
  - `@/constants` - API configuration (base URL, endpoints, keys)
  - `@/types` - TypeScript type definitions
- **External**:
  - Native `fetch` API - HTTP requests
  - `AbortController` - Request timeout handling

## Service Files

| File | Purpose | Documentation |
|------|---------|---------------|
| `cotripApi.ts` | Fetches data from COtrip API | [cotripApi.md](cotripApi.md) |
| `cotripParsers.ts` | Transforms raw API data to map formats | [cotripParsers.md](cotripParsers.md) |

## Usage Pattern

```typescript
import { fetchAllLayerData } from '@/services/cotripApi';
import { parseRoadConditionsToOverlays } from '@/services/cotripParsers';

const rawData = await fetchAllLayerData();
const overlays = parseRoadConditionsToOverlays(rawData.roadConditions);
```

## Related Files
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Uses services for data fetching
- [src/constants/api.md](../constants/api.md) - API configuration used by services
- [src/types/cotrip.md](../types/cotrip.md) - Type definitions for service data

## Design Principles Applied
- **Error resilience**: All functions handle errors gracefully, return empty arrays
- **Timeout handling**: 15-second timeout on all requests
- **No throwing**: Services never throw, always return data or empty arrays
- **Coordinate validation**: Parsers validate coordinates before returning data
- **Type safety**: Explicit TypeScript types for all function signatures

## Implementation Notes
- All API functions are async
- Request timeout via AbortController
- Parallel fetching with Promise.all for all layers
- Parsers filter invalid data (missing IDs, invalid coordinates)
- Log warnings for skipped data items
- Returns empty array on any failure (prevents app crashes)
