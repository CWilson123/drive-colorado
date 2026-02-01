/**
 * Custom hook for managing map layer data and state.
 * Handles fetching, caching, filtering, and auto-refresh of COtrip data layers.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { CACHE_TTL } from '@/constants';
import type { MapOverlayData, MapMarkerData } from '@/types';
import { fetchAllLayerData } from '@/services/cotripApi';
import {
  parseRoadConditionsToOverlays,
  parseIncidentsToMarkers,
  parseWeatherStationsToMarkers,
  parseSnowPlowsToMarkers,
} from '@/services/cotripParsers';

/**
 * Layer type identifiers matching COtrip data endpoints
 */
export type LayerType = 'roadConditions' | 'incidents' | 'weatherStations' | 'snowPlows';

/**
 * Hook return type
 */
export interface UseMapLayersResult {
  overlays: MapOverlayData[];
  markers: MapMarkerData[];
  enabledLayers: Record<LayerType, boolean>;
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  toggleLayer: (id: LayerType) => void;
  refreshData: () => Promise<void>;
}

/**
 * Internal state for cached layer data
 */
interface CachedLayerData {
  roadConditions: MapOverlayData[];
  incidents: MapMarkerData[];
  weatherStations: MapMarkerData[];
  snowPlows: MapMarkerData[];
}

/**
 * Default enabled state for layers
 */
const DEFAULT_ENABLED_LAYERS: Record<LayerType, boolean> = {
  roadConditions: true,
  incidents: true,
  weatherStations: false,
  snowPlows: false,
};

/**
 * Custom hook to manage map layer data and state.
 *
 * Features:
 * - Auto-fetches data on mount for enabled layers
 * - Auto-refreshes every 5 minutes (CACHE_TTL)
 * - Pauses refresh when app is backgrounded
 * - Toggleable layers with instant feedback (uses cached data)
 * - Graceful error handling
 *
 * @returns Object containing layer data, state, and control functions
 */
export const useMapLayers = (): UseMapLayersResult => {
  console.log('[useMapLayers] Hook called/initialized');

  // State for enabled/disabled layers
  const [enabledLayers, setEnabledLayers] = useState<Record<LayerType, boolean>>(
    DEFAULT_ENABLED_LAYERS
  );

  // Cached data for all layers (stays in memory even when layer is disabled)
  const [cachedData, setCachedData] = useState<CachedLayerData>({
    roadConditions: [],
    incidents: [],
    weatherStations: [],
    snowPlows: [],
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for interval and app state tracking
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  /**
   * Fetches and caches data for all layers
   */
  const refreshData = useCallback(async (): Promise<void> => {
    // Don't fetch if app is backgrounded
    if (appStateRef.current !== 'active') {
      return;
    }

    console.log('[useMapLayers] Starting data fetch...');
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all layer data in parallel
      const data = await fetchAllLayerData();

      console.log('[useMapLayers] Fetched raw data:', {
        roadConditions: data.roadConditions.length,
        incidents: data.incidents.length,
        weatherStations: data.weatherStations.length,
        snowPlows: data.snowPlows.length,
      });

      // Parse data into map-ready formats
      const parsedData: CachedLayerData = {
        roadConditions: parseRoadConditionsToOverlays(data.roadConditions),
        incidents: parseIncidentsToMarkers(data.incidents),
        weatherStations: parseWeatherStationsToMarkers(data.weatherStations),
        snowPlows: parseSnowPlowsToMarkers(data.snowPlows),
      };

      console.log('[useMapLayers] Parsed data:', {
        roadConditions: parsedData.roadConditions.length,
        incidents: parsedData.incidents.length,
        weatherStations: parsedData.weatherStations.length,
        snowPlows: parsedData.snowPlows.length,
      });

      setCachedData(parsedData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch layer data';
      setError(errorMessage);
      console.error('[useMapLayers] Failed to refresh layer data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggles a layer on or off
   */
  const toggleLayer = useCallback((id: LayerType): void => {
    setEnabledLayers((prev) => {
      const newState = {
        ...prev,
        [id]: !prev[id],
      };
      console.log('[useMapLayers] Toggled layer:', id, 'enabled:', newState[id]);
      console.log('[useMapLayers] All enabled layers:', newState);
      return newState;
    });
  }, []);

  /**
   * Filters overlays to only include enabled layers
   */
  const filteredOverlays = useMemo((): MapOverlayData[] => {
    const filtered = enabledLayers.roadConditions ? cachedData.roadConditions : [];
    console.log('[useMapLayers] Filtered overlays:', filtered.length, 'roadConditions enabled:', enabledLayers.roadConditions);
    return filtered;
  }, [enabledLayers.roadConditions, cachedData.roadConditions]);

  /**
   * Filters markers to only include enabled layers
   */
  const filteredMarkers = useMemo((): MapMarkerData[] => {
    const markers: MapMarkerData[] = [];

    if (enabledLayers.incidents) {
      markers.push(...cachedData.incidents);
    }
    if (enabledLayers.weatherStations) {
      markers.push(...cachedData.weatherStations);
    }
    if (enabledLayers.snowPlows) {
      markers.push(...cachedData.snowPlows);
    }

    console.log('[useMapLayers] Filtered markers:', {
      total: markers.length,
      incidents: enabledLayers.incidents ? cachedData.incidents.length : 0,
      weatherStations: enabledLayers.weatherStations ? cachedData.weatherStations.length : 0,
      snowPlows: enabledLayers.snowPlows ? cachedData.snowPlows.length : 0,
      enabledLayers,
    });

    return markers;
  }, [
    enabledLayers.incidents,
    enabledLayers.weatherStations,
    enabledLayers.snowPlows,
    cachedData.incidents,
    cachedData.weatherStations,
    cachedData.snowPlows,
  ]);

  // Initial data fetch on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up new interval
    refreshIntervalRef.current = setInterval(() => {
      refreshData();
    }, CACHE_TTL);

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshData]);

  // Handle app state changes (pause refresh when backgrounded)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      // If app comes back to foreground, refresh data
      if (previousState !== 'active' && nextAppState === 'active') {
        refreshData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshData]);

  return {
    overlays: filteredOverlays,
    markers: filteredMarkers,
    enabledLayers,
    isLoading,
    lastUpdated,
    error,
    toggleLayer,
    refreshData,
  };
};
