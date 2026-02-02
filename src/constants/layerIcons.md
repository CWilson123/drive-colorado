# Layer Icons

#metadata
- type: constants
- related: src/components/LayerDropdown/README.md, src/components/MarkerDetailSheet/README.md, src/constants/mapIcons.md
- last_updated: 2026-02-02
- tags: icons, layers, png, assets
#end-metadata

## Purpose
Layer icon configuration using PNG assets. Provides icon component and mapping for each map layer type.

## Layer Keys

| Layer Key | Icon File |
|-----------|-----------|
| `roadConditions` | `road_conditions.png` |
| `incidents` | `incident.png` |
| `weatherStations` | `weather_station_alternate.png` |
| `snowPlows` | `snow_plow.png` |
| `plannedEvents` | `planned_event.png` |
| `dmsSigns` | `dms.png` |
| `workZones` | `work_zone.png` |

## Constants

| Constant | Value | Description |
|----------|--------|-------------|
| `LAYER_ICON_SIZE_SM` | `32` | Small icon size |
| `LAYER_ICON_SIZE_MD` | `32` | Medium icon size (default) |
| `LAYER_ICON_SIZE_LG` | `64` | Large icon size |

## Type Definitions

```typescript
export type LayerKey =
  | 'roadConditions'
  | 'incidents'
  | 'weatherStations'
  | 'snowPlows'
  | 'plannedEvents'
  | 'dmsSigns'
  | 'workZones';

export interface LayerIconConfig {
  image: ImageSourcePropType;
}

export interface LayerIconProps {
  layerKey: LayerKey;
  size?: number;
  style?: any;
}
```

## Component

### LayerIcon

Renders PNG icon for a specified layer.

**Props:**
- `layerKey` (`LayerKey`, required) - The layer to render icon for
- `size` (`number`, optional, default: 32) - Icon size in pixels
- `style` (optional) - Additional styles for container

**Usage:**

```typescript
import { LayerIcon } from '@/constants';

<LayerIcon layerKey="incidents" size={32} />
<LayerIcon layerKey="snowPlows" size={48} />
```

## Helper Function

### getLayerIconConfig

Returns icon configuration for a layer key.

**Signature:** `(layerKey: LayerKey) => LayerIconConfig | undefined`

```typescript
import { getLayerIconConfig } from '@/constants';

const config = getLayerIconConfig('incidents');
```

## Usage Example

```typescript
import {
  LayerIcon,
  LAYER_ICONS,
  LAYER_ICON_SIZE_MD,
} from '@/constants';

// Using component
<LayerIcon layerKey="incidents" size={LAYER_ICON_SIZE_MD} />

// Using config directly
const config = LAYER_ICONS['roadConditions'];
<Image source={config.image} />
```

## Related Files
- [src/components/LayerDropdown/README.md](../components/LayerDropdown/README.md) - Uses LayerIcon component
- [src/components/MarkerDetailSheet/README.md](../components/MarkerDetailSheet/README.md) - Uses LayerIcon component
- [src/constants/mapIcons.md](mapIcons.md) - Image source definitions

## Design Principles Applied
- **Asset management**: PNG icons located in src/assets/map-icons/
- **Type safety**: Explicit TypeScript types for layer keys
- **No magic numbers**: Icon sizes defined as constants

## Implementation Notes
- React Native auto-selects @2x/@3x based on device density
- Icons stored as `require()` for static bundling
- To use alternate variants, change filename in mapIcons.ts
- Component warns in console if unknown layer key provided
