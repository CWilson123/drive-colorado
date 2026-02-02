# Hooks

#metadata
- type: folder
- related: src/services/cotripApi.md, src/screens/HomeScreen.md
- last_updated: 2026-02-02
- tags: hooks, custom, state
#end-metadata

## Purpose
Custom React hooks for complex state management and data fetching logic.

## Dependencies
- **Internal**:
  - `@/types` - TypeScript type definitions
  - `@/services` - API service functions
  - `@/constants` - Configuration values
- **External**:
  - `react` - React hooks (useState, useEffect, useCallback, useMemo, useRef)
  - `react-native` - AppState for app state awareness

## Hook List

| Hook | Purpose | Documentation |
|------|---------|---------------|
| `useMapLayers` | Manages map layer data, caching, auto-refresh | [useMapLayers.md](useMapLayers.md) |

## Usage Pattern

```typescript
import { useMapLayers } from '@/hooks/useMapLayers';

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
```

## Related Files
- [src/screens/HomeScreen.md](../screens/HomeScreen.md) - Uses useMapLayers hook
- [src/services/cotripApi.md](../services/cotripApi.md) - Hook uses API service
- [src/services/cotripParsers.md](../services/cotripParsers.md) - Hook uses parser functions

## Design Principles Applied
- **camelCase naming**: Hooks use camelCase with `use` prefix
- **Return interface**: All hooks have explicit return type interface
- **State encapsulation**: Complex state management hidden in hooks
- **Callback stability**: useCallback for stable function references
- **Memoization**: useMemo for expensive computations

## Implementation Notes
- Hooks handle API errors gracefully
- AppState awareness for background/foreground handling
- Cache management with configurable TTL
- Auto-refresh on foreground (respecting cache TTL)
