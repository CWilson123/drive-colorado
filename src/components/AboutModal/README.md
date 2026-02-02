# AboutModal

#metadata
- type: component
- related: src/screens/HomeScreen.md, src/components/Drawer/README.md
- last_updated: 2026-02-02
- tags: modal, about, legal, attribution
#end-metadata

## Purpose
Modal displaying app information, CDOT data disclaimer, and OpenStreetMap attribution. Slide-up presentation on iOS.

## Dependencies
- **Internal**:
  - `@/constants` - Colors, spacing, typography
  - `./AboutModal.types` - TypeScript interfaces
- **External**:
  - `react-native` - View, Text, Modal, ScrollView, StyleSheet
  - `react-native-safe-area-context` - Safe area insets
  - `@expo/vector-icons` - Feather icons

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Whether modal is visible |
| `onClose` | `() => void` | Yes | - | Callback when modal should close |

## Content

The modal displays:
- App description and version
- CDOT data disclaimer (full legal text)
- OpenStreetMap map attribution
- Close button

## Usage Example

```typescript
import { AboutModal } from '@/components';

<AboutModal
  visible={isAboutModalOpen}
  onClose={() => setIsAboutModalOpen(false)}
/>
```

## Related Files
- [src/screens/HomeScreen.md](../../screens/HomeScreen.md) - Uses AboutModal
- [src/components/Drawer/README.md](../Drawer/README.md) - Opens AboutModal via menu item

## Design Principles Applied
- **No magic numbers**: All dimensions from `@/constants`
- **Single-purpose**: Only displays about information
- **Type safety**: Explicit TypeScript props from `.types.ts`

## Implementation Notes
- Modal animation: slide-up presentation
- Scrollable content for long disclaimer text
- Safe area padding for iOS notch
- PageSheet presentation style on iOS
