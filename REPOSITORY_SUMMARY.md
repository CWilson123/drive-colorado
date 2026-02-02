# Drive Colorado - Repository Summary

## Overview

**Drive Colorado** is a React Native mobile application built with Expo for exploring scenic driving routes in Colorado. The app provides real-time road condition data, weather information, incidents, and traffic details through an interactive map interface centered on the state of Colorado.

### Tech Stack
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo**: ~54.0.32
- **MapLibre React Native**: ^10.4.2 (for map rendering)
- **TypeScript**: ^5.9.2
- **Gesture Handler**: react-native-gesture-handler ^2.30.0

---

## Development Principles (from CLAUDE.md)

### Architecture Principles
1. **Centralized Configuration**: All configurable values (coordinates, zoom levels, API endpoints, colors, timeouts, etc.) must go in `src/constants/` with explicit, descriptive names
2. **No Magic Numbers/Strings**: Never hardcode magic numbers or strings in components
3. **TypeScript Strict Mode**: All types must be explicit
4. **Single-Purpose Components**: Components should be small and single-purpose

### File Structure Conventions
```
src/
├── constants/      - All configuration values, organized by domain
│   ├── map.ts      - Map-related constants (coordinates, zoom, bounds)
│   ├── api.ts      - API endpoints and keys
│   ├── colors.ts   - Colors, spacing, typography
│   ├── layout.ts   - Layout and component sizing
│   └── layerIcons.ts - Layer icon configurations
├── components/     - Reusable UI components
├── screens/        - Full screen views
├── services/       - API calls and data fetching
├── types/          - TypeScript interfaces and types
└── hooks/          - Custom React hooks
```

### Naming Conventions
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_MAP_CENTER`)
- **Components**: `PascalCase` (e.g., `MapView.tsx`)
- **Hooks**: `camelCase` with 'use' prefix (e.g., `useMapLayers`)
- **Types/Interfaces**: `PascalCase` with descriptive names (e.g., `RoadCondition`)

### Map Configuration
- **Map Provider**: MapLibre with OpenFreeMap Liberty vector tiles
- **Default Center**: Denver, CO (39.7392°N, 104.9903°W)
- **Default Zoom**: Level 7 (state-wide view)
- **Zoom Bounds**: Min 5, Max 18
- **Style URL**: `https://tiles.openfreemap.org/styles/liberty`

### Data Sources
- **Road Conditions**: COtrip.org API
- **Traffic Incidents**: COtrip.org API
- **Weather Stations**: COtrip.org API
- **Snow Plows**: COtrip.org API (live tracking)
- **Planned Events**: COtrip.org API
- **DMS Signs**: COtrip.org API (Dynamic Message Signs)
- **Work Zones**: COtrip.org API (WZDx format)

---

## Architecture Details

### Data Flow
1. **API Layer** (`src/services/cotripApi.ts`): Fetches raw data from COtrip API with 15-second timeout
2. **Parser Layer** (`src/services/cotripParsers.ts`): Transforms raw GeoJSON data into map-ready formats
3. **State Management** (`src/hooks/useMapLayers.ts`): Custom hook managing layer data, caching, and auto-refresh
4. **UI Layer** (`src/screens/HomeScreen.tsx`): Renders map with overlays and manages UI state

### Layer System
The app supports 7 toggleable data layers:

| Layer Type | Data Format | Rendering | Default Enabled |
|------------|-------------|-----------|-----------------|
| `roadConditions` | LineString overlays | Lines on map | ✅ Yes |
| `workZones` | LineString/MultiPoint overlays | Lines on map | ❌ No |
| `incidents` | MultiPoint markers | Circles on map | ✅ Yes |
| `weatherStations` | Point markers | Circles on map | ❌ No |
| `snowPlows` | Custom AVL format | Circles on map | ❌ No |
| `plannedEvents` | MultiPoint markers | Circles on map | ❌ No |
| `dmsSigns` | Point markers | Circles on map | ❌ No |

### Color Scheme (Colorado Flag Inspired)
- **Primary Blue**: `#002868` (Colorado Blue)
- **Accent Red**: `#BF0A30` (Colorado Red)
- **Highlight Gold**: `#FFD700` (Colorado Gold)

---

## Key Components

### Screen Components
- **HomeScreen** (`src/screens/HomeScreen.tsx`): Main screen with full-screen map and overlay UI components

### UI Components
- **MapView** (`src/components/Map/MapView.tsx`): Full-screen MapLibre map with user location tracking
- **TopBar** (`src/components/TopBar/`): Top navigation bar with search, menu, and layer controls
- **LayerDropdown** (`src/components/LayerDropdown/`): Dropdown for toggling data layers
- **BottomInfoBar** (`src/components/BottomInfoBar/`): Status bar showing selected feature info
- **MyLocationButton** (`src/components/MyLocationButton/`): Floating button to center on user location
- **Drawer** (`src/components/Drawer/`): Slide-in navigation drawer
- **AboutModal** (`src/components/AboutModal/`): About information modal
- **LoadingOverlay** (`src/components/LoadingOverlay/`): Loading indicator overlay
- **ErrorToast** (`src/components/ErrorToast/`): Error notification toast
- **MarkerDetailSheet** (`src/components/MarkerDetailSheet/`): Bottom sheet for marker/overlay details

### Hooks
- **useMapLayers** (`src/hooks/useMapLayers.ts`): Manages map layer data fetching, caching, filtering, and auto-refresh (5-minute intervals)

---

## API Integration

### COtrip API Configuration
- **Base URL**: `https://data.cotrip.org/api/v1`
- **API Key**: Configured in `src/constants/api.ts`
- **Endpoints**:
  - `/roadConditions` - Road condition segments
  - `/incidents` - Traffic incidents
  - `/weatherStations` - Weather station data
  - `/snowPlows` - Live snow plow tracking
  - `/plannedEvents` - Planned road events
  - `/signs` - Dynamic Message Signs (DMS)
  - `/cwz` - Work Zone Data (WZDx format)

### Data Features
- **Parallel Fetching**: All layer data fetched simultaneously via `Promise.all()`
- **Auto-Refresh**: Data refreshes every 5 minutes (configurable via `CACHE_TTL`)
- **App State Awareness**: Pauses refresh when app is backgrounded, resumes on foreground
- **Error Handling**: Graceful degradation with empty arrays on failures
- **Coordinate Validation**: All coordinates validated before rendering

---

## TypeScript Types

### Core Type Interfaces
- **RoadCondition**: GeoJSON LineString features for road conditions
- **Incident**: GeoJSON MultiPoint features for traffic incidents
- **WeatherStation**: GeoJSON Point features with sensor readings
- **SnowPlow**: Custom AVL format (not GeoJSON) for live vehicle tracking
- **PlannedEvent**: GeoJSON MultiPoint features for planned events
- **DmsSign**: GeoJSON Point features for dynamic message signs
- **WorkZone**: WZDx format features for construction work zones
- **MapMarkerData**: Unified marker interface for rendering points
- **MapOverlayData**: Unified overlay interface for rendering polylines

---

## Constants Reference

### Map Constants (`src/constants/map.ts`)
```typescript
DEFAULT_MAP_CENTER = { latitude: 39.7392, longitude: -104.9903 }  // Denver
DEFAULT_ZOOM_LEVEL = 7
COLORADO_BOUNDS = { north: 41.0, south: 37.0, east: -102.0, west: -109.05 }
MIN_ZOOM = 5
MAX_ZOOM = 18
```

### API Constants (`src/constants/api.ts`)
```typescript
COTRIP_BASE_URL = 'https://data.cotrip.org/api/v1'
CACHE_TTL = 5 * 60 * 1000  // 5 minutes
REQUEST_TIMEOUT = 15000     // 15 seconds
```

### Color Constants (`src/constants/colors.ts`)
```typescript
CO_BLUE = '#002868'
CO_RED = '#BF0A30'
CO_GOLD = '#FFD700'
// ... additional semantic colors, shadows, spacing, typography
```

---

## Development Workflow

### Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

### Key Design Patterns
1. **Component Composition**: Small, reusable components with clear separation of concerns
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Error Resilience**: All parsers and API calls handle errors gracefully
4. **Performance Optimization**: useMemo for filtered data, parallel API fetching
5. **State Management**: Custom hooks for complex state (useMapLayers)
6. **Gesture Handling**: react-native-gesture-handler for swipe interactions

---

## Current Features

### Implemented
- ✅ Interactive MapLibre map centered on Colorado
- ✅ User location tracking with permission handling
- ✅ 7 data layers with toggle functionality
- ✅ Auto-refresh every 5 minutes
- ✅ Road condition overlays (polylines)
- ✅ Work zone overlays (polylines)
- ✅ Point markers for incidents, weather stations, snow plows, planned events, DMS signs
- ✅ Layer dropdown with status indicators
- ✅ Bottom sheet for marker/overlay details
- ✅ Navigation drawer with menu
- ✅ Loading and error states
- ✅ Safe area handling
- ✅ Colorado flag-inspired theme

### Data Types Handled
- **GeoJSON Features**: Standard GeoJSON Feature format (Point, MultiPoint, LineString)
- **Custom AVL Format**: Snow plow data with nested vehicle/location structure
- **WZDx Format**: Work zone data with core_details structure

---

## Notes for AI/Chat Model Context

When working with this repository, keep in mind:

1. **Never hardcode values** - All constants should be in `src/constants/`
2. **Use TypeScript strictly** - All types must be explicit
3. **Follow naming conventions** - See above for specific patterns
4. **Components should be small** - Single responsibility, clear interfaces
5. **API data has mixed formats** - Some endpoints return standard GeoJSON, others return custom structures
6. **Coordinate validation is critical** - Invalid coordinates can crash the map
7. **Error handling is mandatory** - All parsers and API calls must never throw
8. **Layer toggle is instant** - Uses cached data, doesn't re-fetch on toggle
9. **App state affects refresh** - Background state pauses auto-refresh
10. **MapLibre specific** - Uses ShapeSource, LineLayer, CircleLayer for rendering
