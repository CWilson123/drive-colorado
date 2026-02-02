# API Configuration

#metadata
- type: constants
- related: src/services/cotripApi.md, src/hooks/useMapLayers.md
- last_updated: 2026-02-02
- tags: api, configuration, cotrip, cache
#end-metadata

## Purpose
COtrip.org API configuration including endpoints, authentication, and caching settings.

## Constants

| Constant | Value | Description |
|----------|--------|-------------|
| `COTRIP_API_KEY` | `X8GZ2F6-KN3M8PY-QVCN209-VTPZ80X` | COtrip API authentication key |
| `COTRIP_BASE_URL` | `https://data.cotrip.org/api/v1` | Base URL for API v1 |
| `COTRIP_ENDPOINTS` | Object | Endpoint paths for each data type |
| `CACHE_TTL` | `300000` (5 minutes) | Cache time-to-live in milliseconds |

### API Endpoints

| Endpoint Path | Description |
|---------------|-------------|
| `/roadConditions` | Road condition segments |
| `/incidents` | Traffic incidents |
| `/weatherStations` | Weather station data |
| `/snowPlows` | Live snow plow tracking |
| `/plannedEvents` | Planned road events |
| `/signs` | Dynamic Message Signs (DMS) |
| `/cwz` | Work Zone Data (WZDx format) |

## Usage Example

```typescript
import {
  COTRIP_BASE_URL,
  COTRIP_ENDPOINTS,
  COTRIP_API_KEY,
  CACHE_TTL,
} from '@/constants';

const url = `${COTRIP_BASE_URL}${COTRIP_ENDPOINTS.roadConditions}?apiKey=${COTRIP_API_KEY}`;
```

## Related Files
- [src/services/cotripApi.md](../services/cotripApi.md) - Uses these constants
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Uses CACHE_TTL
- [src/constants/README.md](../constants/README.md) - Constants folder overview

## Design Principles Applied
- **Centralized configuration**: All API settings in one file
- **Type safety**: Endpoint paths typed as `as const`
- **No magic numbers**: CACHE_TTL clearly defined

## Implementation Notes
- API key is exposed (client-side public key)
- TTL in milliseconds (5 * 60 * 1000)
- Endpoints match COtrip API v1 paths
- Used by cotripApi.ts for all fetch operations
