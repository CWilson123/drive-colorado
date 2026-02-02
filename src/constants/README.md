# Constants

#metadata
- type: folder
- related: src/components/README.md, src/services/cotripApi.md
- last_updated: 2026-02-02
- tags: constants, configuration, theme
#end-metadata

## Purpose
Centralized configuration values organized by domain. All configurable values live here to avoid magic numbers and strings throughout the codebase.

## Dependencies
- **Internal**: None
- **External**: None

## Constant Files

| File | Purpose | Documentation |
|------|---------|---------------|
| `api.ts` | API endpoints, keys, cache TTL | [api.md](api.md) |
| `colors.ts` | Colors, spacing, typography, shadows | [colors.md](colors.md) |
| `layout.ts` | Component-specific layout dimensions | [layout.md](layout.md) |
| `map.ts` | Map configuration (center, zoom, bounds) | [map.md](map.md) |
| `layerIcons.tsx` | Layer selection icon configurations | [layerIcons.md](layerIcons.md) |
| `mapIcons.ts` | Map marker icon configurations | [mapIcons.md](mapIcons.md) |

## Usage Pattern

```typescript
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_LEVEL,
  CO_BLUE,
  SPACING_MD,
  COTRIP_API_KEY,
} from '@/constants';

// All constants exported from central index.ts
```

## Related Files
- [src/services/cotripApi.md](../services/cotripApi.md) - Uses API constants
- [src/components/Map/README.md](../components/Map/README.md) - Uses map constants
- [src/components/README.md](../components/README.md) - Components use all constant types

## Design Principles Applied
- **Centralized configuration**: Single source of truth for all config
- **SCREAMING_SNAKE_CASE**: Constants use uppercase snake case naming
- **Domain organization**: Constants grouped by function (map, colors, API)
- **Barrel export**: Central `index.ts` for clean imports
- **No magic numbers**: All values exported, never hardcoded

## Implementation Notes
- All constants are TypeScript constants (not mutable)
- Colors include Colorado flag colors and semantic colors
- Map configuration supports bounds-based restrictions
- API constants include timeout and cache TTL values
- Icon configurations sized for map rendering
