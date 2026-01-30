/**
 * MapView component - Full-screen map displaying Colorado with user location.
 *
 * This component provides a MapLibre-based map view centered on Denver, Colorado
 * by default, with automatic centering on the user's location once permissions
 * are granted. Uses Carto raster tiles for the base map.
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, Platform } from 'react-native';
import { MapView as MLMapView, Camera, UserLocation, RasterLayer, RasterSource } from '@maplibre/maplibre-react-native';
import * as ExpoLocation from 'expo-location';
import {
  BASEMAP_RASTER_LAYER_ID,
  BASEMAP_RASTER_SOURCE_ID,
  BASEMAP_RASTER_TILE_URLS,
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_LEVEL,
  MAP_STYLE_JSON,
  MAX_ZOOM,
  MIN_ZOOM,
} from '@/constants';
import { LocationPermissionStatus } from './MapView.types';
import type { MapViewProps, UserLocation as UserLocationData } from './MapView.types';

/**
 * Full-screen map component with user location tracking.
 *
 * Features:
 * - Displays Carto raster tiles via MapLibre
 * - Centers on Denver, CO by default
 * - Requests location permissions on mount
 * - Automatically centers on user location when granted
 * - Falls back to Denver if permissions denied
 *
 * @param props - Component props
 * @returns Rendered map view
 */
export const MapView: React.FC<MapViewProps> = ({ style, onMapReady, onMapError }) => {
  const cameraRef = useRef<Camera>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>(
    LocationPermissionStatus.PENDING
  );
  const [userLocation, setUserLocation] = useState<UserLocationData | null>(null);
  const [hasMovedToUserLocation, setHasMovedToUserLocation] = useState(false);

  /**
   * Request location permissions from the user.
   * Handles both iOS and Android permission flows.
   */
  useEffect(() => {
    const requestLocationPermissions = async (): Promise<void> => {
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          setPermissionStatus(LocationPermissionStatus.GRANTED);

          // Get initial location
          const location = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Balanced,
          });

          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          });
        } else {
          setPermissionStatus(LocationPermissionStatus.DENIED);

          if (Platform.OS === 'ios' && status === 'denied') {
            Alert.alert(
              'Location Permission Required',
              'Please enable location access in Settings to see your current position on the map.',
              [{ text: 'OK' }]
            );
          }
        }
      } catch (error) {
        console.error('Error requesting location permissions:', error);
        setPermissionStatus(LocationPermissionStatus.DENIED);

        if (onMapError) {
          onMapError(error instanceof Error ? error : new Error('Failed to request location permissions'));
        }
      }
    };

    requestLocationPermissions();
  }, [onMapError]);

  /**
   * Center camera on user location once permissions are granted and location is available.
   */
  useEffect(() => {
    if (
      permissionStatus === LocationPermissionStatus.GRANTED &&
      userLocation &&
      !hasMovedToUserLocation &&
      cameraRef.current
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: DEFAULT_ZOOM_LEVEL,
        animationDuration: 1000,
      });
      setHasMovedToUserLocation(true);
    }
  }, [permissionStatus, userLocation, hasMovedToUserLocation]);

  /**
   * Handle map load completion.
   */
  const handleMapReady = (): void => {
    console.log('Map loaded successfully');
    if (onMapReady) {
      onMapReady();
    }
  };

  /**
   * Handle map errors.
   */
  const handleMapError = (error: unknown): void => {
    console.error('Map error:', error);
    if (onMapError && error instanceof Error) {
      onMapError(error);
    }
  };

  /**
   * Handle user location updates from MapLibre.
   */
  const handleLocationUpdate = (location: any): void => {
    if (location?.coords) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? null,
      });
    }
  };

  return (
    <MLMapView
      style={[styles.map, style]}
      styleJSON={JSON.stringify(MAP_STYLE_JSON)}
      onDidFinishLoadingMap={handleMapReady}
      onDidFailLoadingMap={handleMapError}
      logoEnabled={false}
      attributionEnabled={true}
      attributionPosition={{ bottom: 8, right: 8 }}
    >
      <RasterSource id={BASEMAP_RASTER_SOURCE_ID} tileUrlTemplates={BASEMAP_RASTER_TILE_URLS}>
        <RasterLayer id={BASEMAP_RASTER_LAYER_ID} />
      </RasterSource>
      <Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: [DEFAULT_MAP_CENTER.longitude, DEFAULT_MAP_CENTER.latitude],
          zoomLevel: DEFAULT_ZOOM_LEVEL,
        }}
        minZoomLevel={MIN_ZOOM}
        maxZoomLevel={MAX_ZOOM}
      />

      {permissionStatus === LocationPermissionStatus.GRANTED && (
        <UserLocation
          visible={true}
          renderMode="normal"
          showsUserHeadingIndicator={true}
          onUpdate={handleLocationUpdate}
        />
      )}
    </MLMapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
