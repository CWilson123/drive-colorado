# Screens

#metadata
- type: folder
- related: src/components/README.md, src/hooks/README.md
- last_updated: 2026-02-02
- tags: screens, views, navigation
#end-metadata

## Purpose
Full-screen view components that compose UI components to create complete app screens.

## Dependencies
- **Internal**:
  - `@/components` - Reusable UI components
  - `@/hooks` - Custom React hooks
  - `@/types` - TypeScript type definitions
- **External**:
  - `react` - React hooks and component patterns
  - `react-native` - View, StyleSheet
  - `react-native-safe-area-context` - Safe area handling
  - `expo-status-bar` - StatusBar component

## Screen List

| Screen | Purpose | Documentation |
|--------|---------|---------------|
| `HomeScreen` | Main screen with map and UI overlays | [HomeScreen.md](HomeScreen.md) |

## Usage Pattern

```typescript
import { HomeScreen } from '@/screens';

// Screens exported from barrel index.ts
<HomeScreen />
```

## Related Files
- [src/components/README.md](../components/README.md) - All components used by screens
- [src/hooks/README.md](../hooks/README.md) - Hooks used for state management
- [App.tsx](../../App.tsx) - Entry point that renders HomeScreen

## Design Principles Applied
- **Component composition**: Screens compose smaller UI components
- **State management**: Custom hooks for complex state
- **Callback delegation**: Pass callbacks to child components
- **Safe area handling**: SafeAreaProvider wrapper
- **Status bar**: Proper status bar styling

## Implementation Notes
- Screens handle UI state (modals, dropdowns, drawers)
- Business logic delegated to hooks
- Component communication via callbacks
- Centralized error handling (ErrorToast)
- Loading states (LoadingOverlay, BottomInfoBar)
