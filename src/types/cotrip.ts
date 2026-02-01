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
 * Unified marker data for rendering points on the map
 */
export interface MapMarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  layerType: 'incidents' | 'weatherStations' | 'snowPlows';
  title: string;
  subtitle?: string;
  rawData: Incident | WeatherStation | SnowPlow;
}

/**
 * Road condition polyline data for rendering on the map
 */
export interface MapOverlayData {
  id: string;
  coordinates: Array<[number, number]>; // [longitude, latitude]
  layerType: 'roadCondition';
  routeName: string;
  conditions: Array<{
    condition: string;
    timeStamp: string;
  }>;
  color: string;
}
