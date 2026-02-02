# HomeScreen

#metadata
- type: screen
- related: src/components/README.md, src/hooks/useMapLayers.md
- last_updated: 2026-02-02
- tags: screen, home, map, composition
#end-metadata

## Purpose
Main screen displaying the full-screen map of Colorado with overlay UI components for navigation and information.

## Dependencies
- **Internal**:
  - `@/components` - All UI components used
  - `@/hooks` - useMapLayers hook for data
  - `@/types` - MapMarkerData, MapOverlayData
- **External**:
  - `react` - useState, useCallback, useEffect
  - `react-native` - View, StyleSheet
  - `react-native-safe-area-context` - SafeAreaProvider
  - `expo-status-bar` - StatusBar

## State Management

### UI State

| State | Type | Description |
|-------|--------|-------------|
| `isMapReady` | `boolean` | Whether MapLibre map has finished loading |
| `isDrawerOpen` | `boolean` | Whether navigation drawer is visible |
| `isLayerDropdownOpen` | `boolean` | Whether layer dropdown is visible |
| `isAboutModalOpen` | `boolean` | Whether about modal is visible |
| `showInitialLoading` | `boolean` | Whether to show loading overlay on first load |
| `showErrorToast` | `boolean` | Whether error toast is visible |
| `selectedMarker` | `MapMarkerData \| null` | Currently selected marker for detail sheet |
| `selectedOverlay` | `MapOverlayData \| null` | Currently selected overlay for detail sheet |
| `centerOnUserTrigger` | `number` | Trigger counter for MyLocationButton |

### Layer Data (from useMapLayers)

| Property | Type | Description |
|----------|-------|-------------|
| `markers` | `MapMarkerData[]` | Filtered point markers |
| `overlays` | `MapOverlayData[]` | Filtered line overlays |
| `enabledLayers` | `Record<LayerType, boolean>` | Which layers are enabled |
| `isLoading` | `boolean` | Whether data is loading |
| `lastUpdated` | `Date \| null` | Last update timestamp |
| `error` | `string \| null` | Error message if any |
| `toggleLayer` | `(id: LayerType) => void` | Toggle layer on/off |
| `refreshData` | `() => Promise<void>` | Manual refresh trigger |

## Component Composition

The screen renders these components in order:

| Component | Position | Purpose |
|----------|-----------|---------|
| `MapView` | Full-screen background | Map rendering with user location |
| `TopBar` | Top with safe area | Navigation, search, layer controls |
| `Drawer` | Slide-in from left | Navigation menu |
| `LayerDropdown` | Below TopBar | Layer toggle panel |
| `MyLocationButton` | Floating right | Center on user location |
| `BottomInfoBar` | Bottom with safe area | Status info for selected feature |
| `AboutModal` | PageSheet modal | About information |
| `LoadingOverlay` | Below TopBar, above map | Initial loading indicator |
| `ErrorToast` | Above BottomInfoBar | Error notification with retry |
| `MarkerDetailSheet` | Bottom sheet | Detailed feature information |
| `StatusBar` | Top | Expo status bar |

## Interaction Flow

1. **Map Load**: LoadingOverlay shown until map is ready
2. **Data Fetch**: useMapLayers fetches data on mount
3. **Layer Selection**: TopBar button opens LayerDropdown
4. **Feature Selection**: Tap marker/overlay shows BottomInfoBar, tap bar shows MarkerDetailSheet
5. **Error Handling**: Failed fetch shows ErrorToast with retry button
6. **Navigation**: Menu button opens Drawer, About modal shown from menu

## Usage Example

```typescript
import { HomeScreen } from '@/screens';

// Rendered from App.tsx
<HomeScreen />
```

## Related Files
- [src/components/README.md](../components/README.md) - All components used
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Data management hook
- [App.tsx](../../App.tsx) - Entry point that renders HomeScreen

## Design Principles Applied
- **Component composition**: Screen built from smaller UI components
- **State management**: Complex state delegated to useMapLayers hook
- **Callback delegation**: Parent communicates with children via callbacks
- **Single-purpose**: Screen only handles UI composition and routing
- **Safe area handling**: SafeAreaProvider wrapper for iOS notch

## Implementation Notes
- Central state for all UI components
- useMapLayers hook provides filtered data based on enabledLayers
- Initial loading overlay hides after map is ready
- Error toast provides retry for failed fetches
- Selected marker/overlay data flows from MapView → BottomInfoBar → MarkerDetailSheet
- All modals/drawers/dropdowns use gesture handler for swipe interactions
- Search functionality placeholder (not implemented)
