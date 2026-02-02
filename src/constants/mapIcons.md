# Map Icons

#metadata
- type: constants
- related: src/constants/layerIcons.md, src/components/Map/README.md, src/assets/map-icons/
- last_updated: 2026-02-02
- tags: icons, map-markers, png, assets
#end-metadata

## Purpose
Map marker icon configuration using PNG assets. Defines image sources and sizing for map markers rendered via SymbolLayer.

## Icon Configuration

All icons located in `src/assets/map-icons/` with @2x/@3x variants for high-DPI displays.

| Layer Key | Icon File | Usage |
|-----------|-----------|-------|
| `roadConditions` | `road_conditions.png` | Road condition markers (not typically shown) |
| `incidents` | `incident.png` | Traffic incident markers |
| `weatherStations` | `weather_station_alternate.png` | Weather station markers |
| `snowPlows` | `snow_plow.png` | Live snow plow markers |
| `plannedEvents` | `planned_event.png` | Planned event markers |
| `dmsSigns` | `dms.png` | Dynamic Message Sign markers |
| `workZones` | `work_zone.png` | Work zone markers (not typically shown) |

## Constants

| Constant | Value | Description |
|----------|--------|-------------|
| `MARKER_ICON_SIZE` | `32` | Base size for map markers (SymbolLayer) |
| `LAYER_ICON_SIZE_MD` | `32` | Medium icon size for UI components |
| `LAYER_ICON_SIZE_LG` | `64` | Large icon size for UI components |

## Usage Example

```typescript
import {
  LAYER_ICON_IMAGES,
  MARKER_ICON_SIZE,
} from '@/constants';

// Access icon image
const iconSource = LAYER_ICON_IMAGES.incidents;

// Use in map SymbolLayer
<SymbolLayer
  style={{
    iconImage: 'incidents',
    iconSize: MARKER_ICON_SIZE / 32,
  }}
/>

// Load images in MapView
<Images images={LAYER_ICON_IMAGES} />
```

## Related Files
- [src/components/Map/README.md](../components/Map/README.md) - Uses these icons in SymbolLayer
- [src/constants/layerIcons.md](layerIcons.md) - LayerIcon component that wraps these icons
- [src/assets/map-icons/](../../assets/map-icons/) - PNG asset files

## Design Principles Applied
- **Asset management**: PNG icons with @2x/@3x variants
- **Type safety**: Record type with LayerKey keys
- **No magic numbers**: Icon sizes defined as constants

## Implementation Notes
- React Native auto-selects @2x/@3x based on device density
- All icons bundled as static assets via `require()`
- MARKER_ICON_SIZE (32px) divided by 32 = 1.0 scale factor for SymbolLayer
- To switch to alternate icon variants, change filename in require() path
- Icons sized for good visibility on map
