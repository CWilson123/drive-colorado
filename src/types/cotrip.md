# COtrip Types

#metadata
- type: types
- related: src/services/cotripApi.md, src/services/cotripParsers.md, src/hooks/useMapLayers.md
- last_updated: 2026-02-02
- tags: types, geojson, cotrip, interfaces
#end-metadata

## Purpose
TypeScript interfaces for COtrip.org API data structures. Includes both raw API types and unified map-ready types.

## COtrip API Types

### RoadCondition

GeoJSON LineString feature for road condition segments.

**Geometry:** `LineString`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `id` (string) - Unique identifier
- `routeName` (string) - Highway/route name
- `direction` (string) - Travel direction
- `currentConditions` (array) - Current condition list with `condition` and `timeStamp`
- `startMarker` (string) - Starting mile marker
- `endMarker` (string) - Ending mile marker

### Incident

GeoJSON MultiPoint feature for traffic incidents.

**Geometry:** `MultiPoint`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `id` (string) - Unique identifier
- `type` (string) - Incident type
- `severity` (string) - Severity level
- `status` (string) - Current status
- `routeName` (string) - Highway/route name
- `direction` (string) - Travel direction
- `startTime` (string) - Start timestamp
- `lastUpdated` (string) - Last update timestamp
- `laneImpacts` (array) - Lane impact details
- `category` (string) - Incident category

### WeatherStation

GeoJSON Point feature for weather station data.

**Geometry:** `Point`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `id` (string) - Unique identifier
- `name` (string) - Station name
- `publicName` (string) - Public display name
- `routeName` (string) - Highway/route name
- `direction` (string) - Travel direction
- `sensors` (array) - Sensor readings
- `lastUpdated` (string) - Last update timestamp
- `communicationStatus` (string) - Communication status

**Sensor:**
- `id` (string) - Sensor ID
- `name` (string) - Sensor name
- `type` (string) - Sensor type
- `currentReading` (string) - Current value

### SnowPlow

Custom AVL (Automatic Vehicle Location) format - NOT GeoJSON.

**Structure:**
- `avl_location` - Nested object
  - `vehicle` - Vehicle details (id, id2, fleet, type, sub_type)
  - `position` - Location data (latitude, longitude, bearing, speed)
  - `current_status` - Status info (state, info)
- `rtdh_timestamp` (number) - Epoch seconds

### PlannedEvent

GeoJSON MultiPoint feature for planned road events.

**Geometry:** `MultiPoint`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `id` (string) - Unique identifier
- `name` (string) - Event name
- `type` (string) - Event type
- `routeName` (string) - Highway/route name
- `startTime` (string) - Start timestamp
- `clearTime` (string) - Clear time
- `travelerInformationMessage` (string) - Public message
- `laneImpacts` (array) - Lane impact details
- `schedule` (array) - Schedule entries with `startTime` and `endTime`
- `project` - Project info with `description` and `status`
- `isOversizedLoadsProhibited` (boolean) - Oversized load flag

**LaneImpact:**
- `direction` (string) - Travel direction
- `laneCount` (number) - Number of lanes
- `closedLaneTypes` (array) - Closed lane types

### DmsSign

GeoJSON Point feature for Dynamic Message Signs.

**Geometry:** `Point`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `id` (string) - Unique identifier
- `name` (string) - Sign name
- `publicName` (string) - Public display name
- `routeName` (string) - Highway/route name
- `direction` (string) - Travel direction
- `displayStatus` (string) - Display status (`'off'`, `'on'`, etc.)
- `communicationStatus` (string) - Communication status
- `marker` (string) - Mile marker
- `lastUpdated` (string) - Last update timestamp
- `currentMessage` (array, optional) - Current message lines

### WorkZone

WZDx (Work Zone Data Exchange) format feature.

**Geometry:** `LineString` or `MultiPoint`
**Coordinates:** `[longitude, latitude]`

**Properties:**
- `core_details` - Nested object
  - `name` (string) - Zone name
  - `road_names` (array) - Affected roads
  - `direction` (string) - Travel direction
  - `description` (string) - Description
  - `event_type` (string) - Event type
  - `data_source_id` (string) - Data source ID

## Unified Map Types

### MapMarkerData

Unified format for point markers rendered on map.

```typescript
export interface MapMarkerData {
  id: string;
  coordinate: { latitude: number; longitude: number };
  layerType: 'incidents' | 'weatherStations' | 'snowPlows' | 'plannedEvents' | 'dmsSigns';
  title: string;
  subtitle?: string;
  rawData: Incident | WeatherStation | SnowPlow | PlannedEvent | DmsSign;
}
```

### MapOverlayData

Unified format for polyline overlays rendered on map.

```typescript
export interface MapOverlayData {
  id: string;
  coordinates: Array<[number, number]>; // [longitude, latitude]
  layerType: 'roadCondition' | 'workZone';
  routeName: string;
  conditions?: Array<{ condition: string; timeStamp: string }>;
  color: string;
  description?: string; // Work zone specific
  direction?: string; // Work zone specific
  eventType?: string; // Work zone specific
  rawData?: WorkZone;
}
```

## Coordinate Format

All coordinates use GeoJSON format: `[longitude, latitude]` (x, y order).

## Usage Example

```typescript
import {
  RoadCondition,
  Incident,
  MapMarkerData,
  MapOverlayData,
} from '@/types';

// Type from API
const roadCondition: RoadCondition = await fetchRoadConditions();

// Type for map rendering
const marker: MapMarkerData = {
  id: incident.properties.id,
  coordinate: {
    latitude: incident.geometry.coordinates[0][1],
    longitude: incident.geometry.coordinates[0][0],
  },
  layerType: 'incidents',
  title: incident.properties.routeName,
  subtitle: incident.properties.severity,
  rawData: incident,
};
```

## Related Files
- [src/services/cotripApi.md](../services/cotripApi.md) - Functions return these types
- [src/services/cotripParsers.md](../services/cotripParsers.md) - Transforms to map-ready types
- [src/hooks/useMapLayers.md](../hooks/useMapLayers.md) - Uses map-ready types
- [src/types/README.md](../types/README.md) - Types folder overview

## Design Principles Applied
- **Type safety**: Explicit interfaces for all data structures
- **GeoJSON standards**: Follows GeoJSON Feature format where applicable
- **Unified formats**: MapMarkerData and MapOverlayData for rendering
- **Custom structures**: Handle non-GeoJSON data (snow plows, work zones)

## Implementation Notes
- Road conditions and work zones rendered as overlays (LineString)
- Incidents, weather stations, snow plows, planned events, DMS signs rendered as markers (Point)
- Snow plows use custom AVL format, not standard GeoJSON
- Work zones use WZDx format with nested `core_details`
- All coordinates are `[longitude, latitude]` (GeoJSON standard)
- Map-ready types extracted from raw data by parsers
