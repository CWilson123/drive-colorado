/**
 * Central export point for all TypeScript types and interfaces.
 * Import types from this file to ensure clean, organized imports throughout the app.
 *
 * Example usage:
 *   import { RoadCondition, Incident, MapMarkerData } from '@/types';
 */

// COtrip data types
export type {
  RoadCondition,
  Incident,
  WeatherStation,
  SnowPlow,
  PlannedEvent,
  DmsSign,
  WorkZone,
  LaneImpact,
  ScheduleEntry,
  ProjectInfo,
  WorkZoneCoreDetails,
  Sensor,
  MapMarkerData,
  MapOverlayData,
} from './cotrip';
