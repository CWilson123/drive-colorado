/**
 * TypeScript interfaces for COtrip.org API data structures.
 * These types represent the various data models returned by the COtrip API.
 */

/**
 * GeoJSON Feature representing a road condition segment
 */
export interface RoadCondition {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: Array<[number, number]>; // [longitude, latitude]
  };
  properties: {
    id: string;
    routeName: string;
    direction: string;
    currentConditions: Array<{
      condition: string;
      timeStamp: string;
    }>;
    startMarker: string;
    endMarker: string;
  };
}

/**
 * GeoJSON Feature representing a traffic incident
 */
export interface Incident {
  type: 'Feature';
  geometry: {
    type: 'MultiPoint';
    coordinates: Array<[number, number]>; // [longitude, latitude]
  };
  properties: {
    id: string;
    type: string;
    severity: string;
    status: string;
    routeName: string;
    direction: string;
    startTime: string;
    lastUpdated: string;
    laneImpacts: Array<{
      fromLane: string;
      toLane: string;
      laneStatus: string;
    }>;
    category: string;
  };
}

/**
 * Sensor reading from a weather station
 */
export interface Sensor {
  id: string;
  name: string;
  type: string;
  currentReading: string;
}

/**
 * GeoJSON Feature representing a weather station
 */
export interface WeatherStation {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    name: string;
    publicName: string;
    routeName: string;
    direction: string;
    sensors: Sensor[];
    lastUpdated: string;
    communicationStatus: string;
  };
}

/**
 * Snow plow tracking data (NOT GeoJSON format)
 */
export interface SnowPlow {
  avl_location: {
    vehicle: {
      id: string;
      id2: string;
      fleet: string;
      type: string;
      sub_type: string;
    };
    position: {
      latitude: number;
      longitude: number;
      bearing: number;
      speed: number;
    };
    current_status: {
      state: string;
      info: string;
    };
  };
  rtdh_timestamp: number; // epoch seconds
}

/**
 * Lane impact information for planned events
 */
export interface LaneImpact {
  direction: string;
  laneCount: number;
  closedLaneTypes: string[];
}

/**
 * Schedule entry for planned events
 */
export interface ScheduleEntry {
  startTime: string;
  endTime: string;
}

/**
 * Project information for planned events
 */
export interface ProjectInfo {
  description: string;
  status: string;
}

/**
 * GeoJSON Feature representing a planned event (MultiPoint geometry)
 */
export interface PlannedEvent {
  type: 'Feature';
  geometry: {
    type: 'MultiPoint';
    coordinates: Array<[number, number]>; // [longitude, latitude]
  };
  properties: {
    id: string;
    name: string;
    type: string;
    routeName: string;
    startTime: string;
    clearTime: string;
    travelerInformationMessage: string;
    laneImpacts: LaneImpact[];
    schedule: ScheduleEntry[];
    project: ProjectInfo;
    isOversizedLoadsProhibited: boolean;
  };
}

/**
 * GeoJSON Feature representing a DMS (Dynamic Message Sign)
 */
export interface DmsSign {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    name: string;
    publicName: string;
    routeName: string;
    direction: string;
    displayStatus: string; // 'off', 'on', etc.
    communicationStatus: string; // 'operational', etc.
    marker: string; // mile marker
    lastUpdated: string;
    currentMessage?: string[];
  };
}

/**
 * Core details for WZDx work zone data
 */
export interface WorkZoneCoreDetails {
  name: string;
  road_names: string[];
  direction: string;
  description: string;
  event_type: string;
  data_source_id: string;
}

/**
 * WZDx (Work Zone Data Exchange) format feature
 */
export interface WorkZone {
  type: 'Feature';
  geometry: {
    type: 'LineString' | 'MultiPoint';
    coordinates: Array<[number, number]>; // [longitude, latitude]
  };
  properties: {
    core_details: WorkZoneCoreDetails;
  };
}

/**
 * Unified marker data for rendering points on the map
 */
export interface MapMarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  layerType: 'incidents' | 'weatherStations' | 'snowPlows' | 'plannedEvents' | 'dmsSigns';
  title: string;
  subtitle?: string;
  rawData: Incident | WeatherStation | SnowPlow | PlannedEvent | DmsSign;
}

/**
 * Road condition / work zone polyline data for rendering on the map
 */
export interface MapOverlayData {
  id: string;
  coordinates: Array<[number, number]>; // [longitude, latitude]
  layerType: 'roadCondition' | 'workZone';
  routeName: string;
  conditions?: Array<{
    condition: string;
    timeStamp: string;
  }>;
  color: string;
  /** Work zone specific fields */
  description?: string;
  direction?: string;
  eventType?: string;
  rawData?: WorkZone;
}
