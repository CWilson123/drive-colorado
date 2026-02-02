# Types

#metadata
- type: folder
- related: src/services/cotripApi.md, src/services/cotripParsers.md
- last_updated: 2026-02-02
- tags: types, typescript, interfaces
#end-metadata

## Purpose
TypeScript type definitions and interfaces for type safety across the application.

## Dependencies
- **Internal**: None
- **External**: None

## Type Files

| File | Purpose | Documentation |
|------|---------|---------------|
| `cotrip.ts` | COtrip API data types | [cotrip.md](cotrip.md) |
| `index.ts` | Barrel export for all types | - |

## Usage Pattern

```typescript
import { RoadCondition, Incident, MapMarkerData, MapOverlayData } from '@/types';

// All types exported from central index.ts
// Types include GeoJSON features and map-ready formats
```

## Related Files
- [src/services/cotripApi.md](../services/cotripApi.md) - Functions return COtrip types
- [src/services/cotripParsers.md](../services/cotripParsers.md) - Parsers transform COtrip types to map types
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Hook uses map marker/overlay types

## Design Principles Applied
- **Explicit types**: All interfaces and types are explicit
- **Type separation**: Raw API types separate from map-ready types
- **GeoJSON standards**: Follow GeoJSON Feature format where applicable
- **Type guards**: Use type checking where needed
- **No any**: Avoid `any` type, use explicit types

## Implementation Notes
- COtrip types reflect API response structure
- MapMarkerData and MapOverlayData are unified formats for rendering
- GeoJSON Feature interface used for API data
- Custom structures for non-GeoJSON data (snow plows, work zones)
