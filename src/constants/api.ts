/**
 * API configuration constants for COtrip.org and other external data sources.
 * All API endpoints, keys, and caching configuration are defined here.
 */

/**
 * COtrip API authentication key
 */
export const COTRIP_API_KEY = 'X8GZ2F6-KN3M8PY-QVCN209-VTPZ80X';

/**
 * Base URL for COtrip API v1
 */
export const COTRIP_BASE_URL = 'https://data.cotrip.org/api/v1';

/**
 * COtrip API endpoint paths
 */
export const COTRIP_ENDPOINTS = {
  roadConditions: '/roadConditions',
  incidents: '/incidents',
  weatherStations: '/weatherStations',
  snowPlows: '/snowPlows',
  plannedEvents: '/plannedEvents',
  dmsSigns: '/signs',
  workZones: '/cwz',
} as const;

/**
 * Cache time-to-live in milliseconds (5 minutes)
 */
export const CACHE_TTL = 5 * 60 * 1000;
