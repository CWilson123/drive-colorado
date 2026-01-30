/**
 * MapView component - Full-screen map displaying Colorado with user location.
 *
 * This component provides a MapLibre-based map view centered on Denver, Colorado
 * by default, with automatic centering on the user's location once permissions
 * are granted. Uses Carto vector tiles for the base map.
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, Platform } from 'react-native';
import {
  MapView as MLMapView,
  Camera,
  UserLocation,
  RasterSource,
  RasterLayer,
} from '@maplibre/maplibre-react-native';
import * as ExpoLocation from 'expo-location';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL, MIN_ZOOM, MAX_ZOOM, MAP_STYLE_URL } from '@/constants';
import { LocationPermissionStatus } from './MapView.types';
import type { MapViewProps, UserLocation as UserLocationData } from './MapView.types';

/**
 * Full-screen map component with user location tracking.
 *
 * Features:
 * - Displays Carto vector tiles via MapLibre
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
  const [isStyleReady, setIsStyleReady] = useState(false);
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
    let isMounted = true;
  
    const testStyleFetch = async () => {
      try {
        const res = await fetch(MAP_STYLE_URL, { method: 'GET' });
        const text = await res.text();
  
        if (!isMounted) return;
  
        console.log('Style fetch status:', res.status);
        console.log('Style fetch first 120 chars:', text.slice(0, 120));
      } catch (e) {
        if (!isMounted) return;
        console.error('Style fetch failed:', e);
      }
    };
  
    testStyleFetch();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (!isStyleReady || !cameraRef.current) return;
  
    // Force a very obvious street-level view in Denver.
    cameraRef.current.setCamera({
      centerCoordinate: [-104.9903, 39.7392],
      zoomLevel: 13,
      animationDuration: 800,
    });
  
    console.log('Forced camera to Denver z=13 for debug');
  }, [isStyleReady]);
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
      styleURL={MAP_STYLE_URL}
      onDidFinishLoadingStyle={() => {
        console.log('Style fully loaded');
        setIsStyleReady(true);
      }}
      onDidFailLoadingStyle={(e) => console.error('Style failed:', e)}
      onDidFinishLoadingMap={handleMapReady}
      onDidFailLoadingMap={handleMapError}
      logoEnabled={false}
      attributionEnabled={true}
      attributionPosition={{ bottom: 8, right: 8 }}
    >
      <RasterSource
        id="carto-raster"
        tileUrlTemplates={[
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        ]}
      >
        <RasterLayer id="carto-raster-layer" />
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
