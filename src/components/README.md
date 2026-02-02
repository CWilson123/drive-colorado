# Components

#metadata
- type: folder
- related: src/constants/README.md, src/types/README.md, src/screens/HomeScreen.md
- last_updated: 2026-02-02
- tags: components, ui, reusable
#end-metadata

## Purpose
Reusable UI components used throughout the app. Each component follows a consistent structure with separate types files and barrel exports.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography, icons, layout values
  - `@/types` - TypeScript type definitions
- **External**:
  - `react-native` - Core React Native components
  - `@maplibre/maplibre-react-native` - Map components
  - `react-native-gesture-handler` - Gesture handling
  - `react-native-safe-area-context` - Safe area handling
  - `@expo/vector-icons` - Icon components
  - `lucide-react-native` - Additional icons
  - `expo-linear-gradient` - Gradient backgrounds

## Component List

| Component | Purpose | Documentation |
|-----------|---------|----------------|
| `MapView` | Full-screen MapLibre map | [Map/README.md](Map/README.md) |
| `TopBar` | Top navigation bar | [TopBar/README.md](TopBar/README.md) |
| `LayerDropdown` | Layer selection dropdown | [LayerDropdown/README.md](LayerDropdown/README.md) |
| `Drawer` | Slide-in navigation drawer | [Drawer/README.md](Drawer/README.md) |
| `BottomInfoBar` | Status bar for selected features | [BottomInfoBar/README.md](BottomInfoBar/README.md) |
| `MyLocationButton` | Floating location button | [MyLocationButton/README.md](MyLocationButton/README.md) |
| `MarkerDetailSheet` | Bottom sheet for marker details | [MarkerDetailSheet/README.md](MarkerDetailSheet/README.md) |
| `AboutModal` | About information modal | [AboutModal/README.md](AboutModal/README.md) |
| `LoadingOverlay` | Loading indicator overlay | [LoadingOverlay/README.md](LoadingOverlay/README.md) |
| `ErrorToast` | Error notification toast | [ErrorToast/README.md](ErrorToast/README.md) |

## Usage Pattern

```typescript
import { MapView, TopBar, LayerDropdown } from '@/components';

// Components are imported from central barrel export
// Type exports are included automatically
```

## Related Files
- [src/screens/HomeScreen.md](../screens/HomeScreen.md) - Uses all components
- [src/constants/colors.md](../constants/colors.md) - Color constants used by components
- [src/constants/layout.md](../constants/layout.md) - Layout constants used by components

## Design Principles Applied
- **Barrel exports**: Central `index.ts` for clean imports
- **Type separation**: Each component has separate `.types.ts` file
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Each component handles one UI concern
- **Callback-based**: Props use callbacks for parent communication

## Implementation Notes
- All components use TypeScript with explicit types
- Safe area handling via `useSafeAreaInsets` hook
- Gesture handler wrapper for swipe interactions (Drawer, MarkerDetailSheet)
- Colorado flag-inspired color theme from constants
