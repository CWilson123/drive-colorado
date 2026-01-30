# Drive Colorado - Development Guidelines

## Architecture Principles
- All configurable values (coordinates, zoom levels, API endpoints, colors, timeouts, etc.) must go in src/constants/ with explicit, descriptive names
- Never hardcode magic numbers or strings in components
- Use TypeScript strict mode - all types must be explicit
- Components should be small and single-purpose

## File Structure
- src/constants/ - All configuration values, organized by domain
  - map.ts - Map-related constants (coordinates, zoom, bounds)
  - api.ts - API endpoints and keys
  - theme.ts - Colors, spacing, typography
- src/components/ - Reusable UI components
- src/screens/ - Full screen views
- src/services/ - API calls and data fetching
- src/types/ - TypeScript interfaces and types
- src/hooks/ - Custom React hooks

## Naming Conventions
- Constants: SCREAMING_SNAKE_CASE (e.g., DEFAULT_MAP_CENTER)
- Components: PascalCase (e.g., MapView.tsx)
- Hooks: camelCase with 'use' prefix (e.g., useRoadConditions.ts)
- Types/Interfaces: PascalCase with descriptive names (e.g., RoadCondition)

## Map Configuration
- Map provider: MapLibre with OpenStreetMap tiles
- Default center: Denver area (will be defined in constants)
- Default zoom: State-wide view of Colorado

## Data Sources
- Road conditions: COtrip.org API
- Traffic cameras: COtrip.org API
- Weather: National Weather Service API
