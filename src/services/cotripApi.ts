/**
 * COtrip API data fetching service.
 * Provides async functions to fetch road conditions, incidents, weather stations, and snow plows.
 * All functions include error handling and return empty arrays on failure to prevent app crashes.
 */

import {
  COTRIP_API_KEY,
  COTRIP_BASE_URL,
  COTRIP_ENDPOINTS,
} from '@/constants';
import type {
  RoadCondition,
  Incident,
  WeatherStation,
  SnowPlow,
} from '@/types';

/**
 * Request timeout in milliseconds (15 seconds)
 */
const REQUEST_TIMEOUT = 15000;

/**
 * Fetches current road conditions from COtrip API
 * @returns Array of road condition features, or empty array on error
 */
export const fetchRoadConditions = async (): Promise<RoadCondition[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `${COTRIP_BASE_URL}${COTRIP_ENDPOINTS.roadConditions}?apiKey=${COTRIP_API_KEY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch road conditions:', error);
    return [];
  }
};

/**
 * Fetches current traffic incidents from COtrip API
 * @returns Array of incident features, or empty array on error
 */
export const fetchIncidents = async (): Promise<Incident[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `${COTRIP_BASE_URL}${COTRIP_ENDPOINTS.incidents}?apiKey=${COTRIP_API_KEY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch incidents:', error);
    return [];
  }
};

/**
 * Fetches weather station data from COtrip API
 * @returns Array of weather station features, or empty array on error
 */
export const fetchWeatherStations = async (): Promise<WeatherStation[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `${COTRIP_BASE_URL}${COTRIP_ENDPOINTS.weatherStations}?apiKey=${COTRIP_API_KEY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch weather stations:', error);
    return [];
  }
};

/**
 * Fetches active snow plow locations from COtrip API
 * Note: SnowPlow data structure is different from standard GeoJSON features
 * @returns Array of snow plow records, or empty array on error
 */
export const fetchSnowPlows = async (): Promise<SnowPlow[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `${COTRIP_BASE_URL}${COTRIP_ENDPOINTS.snowPlows}?apiKey=${COTRIP_API_KEY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // Snow plows have a different structure - features array contains records with avl_location
    return data.features || [];
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch snow plows:', error);
    return [];
  }
};

/**
 * Layer data result type for fetchAllLayerData
 */
export interface LayerDataResult {
  roadConditions: RoadCondition[];
  incidents: Incident[];
  weatherStations: WeatherStation[];
  snowPlows: SnowPlow[];
}

/**
 * Fetches all layer data in parallel for improved performance
 * @returns Object containing arrays for all layer types
 */
export const fetchAllLayerData = async (): Promise<LayerDataResult> => {
  try {
    const [roadConditions, incidents, weatherStations, snowPlows] = await Promise.all([
      fetchRoadConditions(),
      fetchIncidents(),
      fetchWeatherStations(),
      fetchSnowPlows(),
    ]);

    return {
      roadConditions,
      incidents,
      weatherStations,
      snowPlows,
    };
  } catch (error) {
    console.error('Failed to fetch all layer data:', error);
    // Return empty arrays for all layers on catastrophic failure
    return {
      roadConditions: [],
      incidents: [],
      weatherStations: [],
      snowPlows: [],
    };
  }
};
