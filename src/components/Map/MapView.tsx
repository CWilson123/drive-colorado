/**
 * MapView component - Full-screen map displaying Colorado with user location.
 *
 * This component provides a MapLibre-based map view centered on Denver, Colorado
 * by default, with automatic centering on the user's location once permissions
 * are granted. Uses OpenFreeMap Liberty vector tiles for the base map.
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Alert, Platform } from 'react-native';
import {
  MapView as MLMapView,
  Camera,
  UserLocation,
  ShapeSource,
  LineLayer,
  SymbolLayer,
  Images,
  type CameraRef,
} from '@maplibre/maplibre-react-native';
import * as ExpoLocation from 'expo-location';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_LEVEL,
  MAX_ZOOM,
  MIN_ZOOM,
  OPENFREEMAP_LIBERTY_STYLE_URL,
  CO_BLUE,
  CO_RED,
  CO_GOLD,
  LAYER_ICON_IMAGES,
  MARKER_ICON_SIZE,
} from '@/constants';
import { LocationPermissionStatus } from './MapView.types';
import type { MapViewProps, UserLocation as UserLocationData } from './MapView.types';
import type { MapMarkerData, DmsSign } from '@/types';

/** Work zone overlay color (orange/amber) */
const WORK_ZONE_COLOR = '#F59E0B';

/** Size for symbol icons (MapLibre uses 32px as base, so 48/32 = 1.5) */
const SYMBOL_ICON_SIZE = MARKER_ICON_SIZE / 32;

/**
 * Full-screen map component with user location tracking.
 *
 * Features:
 * - Displays OpenFreeMap Liberty vector tiles via MapLibre
 * - Centers on Denver, CO by default
 * - Requests location permissions on mount
 * - Automatically centers on user location when granted
 * - Falls back to Denver if permissions denied
 *
 * @param props - Component props
 * @returns Rendered map view
 */
export const MapViewInner: React.FC<MapViewProps> = ({
  style,
  onMapReady,
  onMapError,
  centerOnUserTrigger = 0,
  overlays,
  markers,
  onMarkerPress,
  onOverlayPress,
}) => {
  const cameraRef = useRef<CameraRef>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>(
    LocationPermissionStatus.PENDING
  );
  const [userLocation, setUserLocation] = useState<UserLocationData | null>(null);
  const [hasMovedToUserLocation, setHasMovedToUserLocation] = useState(false);

  // Debug logging - data received as props from HomeScreen
  useEffect(() => {
    console.log('[MapView] Received data as props:', {
      markers: markers.length,
      overlays: overlays.length,
    });
  }, [markers, overlays]);

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
   * Only runs once when initial location is obtained, not on subsequent location updates.
   */
  useEffect(() => {
    console.log('[MapView] Initial location effect:', {
      permissionStatus,
      hasUserLocation: !!userLocation,
      hasMovedToUserLocation,
      hasCameraRef: !!cameraRef.current,
    });
    if (
      permissionStatus === LocationPermissionStatus.GRANTED &&
      userLocation &&
      !hasMovedToUserLocation &&
      cameraRef.current
    ) {
      console.log('[MapView] Moving camera to user location (initial)');
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: DEFAULT_ZOOM_LEVEL,
        animationDuration: 1000,
      });
      setHasMovedToUserLocation(true);
    }
    // Only run when permission status changes or hasMovedToUserLocation changes
    // Intentionally NOT including userLocation to prevent re-centering on location updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionStatus, hasMovedToUserLocation]);

  /**
   * Center on user location when MyLocationButton is pressed.
   * Triggered by incrementing centerOnUserTrigger prop.
   */
  useEffect(() => {
    console.log('[MapView] centerOnUserTrigger effect:', {
      centerOnUserTrigger,
      permissionStatus,
      hasUserLocation: !!userLocation,
    });
    if (
      centerOnUserTrigger > 0 &&
      permissionStatus === LocationPermissionStatus.GRANTED &&
      userLocation &&
      cameraRef.current
    ) {
      console.log('[MapView] Moving camera to user location (button press)');
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: DEFAULT_ZOOM_LEVEL,
        animationDuration: 1000,
      });
    }
  }, [centerOnUserTrigger, permissionStatus, userLocation]);

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
   * Handle map load failure.
   */
  const handleMapError = (): void => {
    console.error('Map failed to load');
    if (onMapError) {
      onMapError(new Error('Map failed to load'));
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

  /**
   * Convert markers to GeoJSON FeatureCollection for native CircleLayer rendering.
   * This ensures markers are rendered by the GL engine and don't drift during panning.
   */
  const markersGeoJSON = useMemo(() => {
    const features = markers.map((marker) => {
      // Check if DMS sign is off (dimmed)
      let isDimmed = false;
      if (marker.layerType === 'dmsSigns') {
        const dmsSign = marker.rawData as DmsSign;
        if (dmsSign?.properties?.displayStatus === 'off') {
          isDimmed = true;
        }
      }

      return {
        type: 'Feature' as const,
        id: marker.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [marker.coordinate.longitude, marker.coordinate.latitude],
        },
        properties: {
          id: marker.id,
          layerType: marker.layerType,
          title: marker.title,
          isDimmed,
        },
      };
    });

    console.log('[MapView] Created markersGeoJSON:', {
      featureCount: features.length,
    });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [markers]);

  /**
   * Handle marker press from ShapeSource onPress event.
   * Finds the corresponding marker data and calls the callback.
   */
  const handleMarkerPress = useCallback(
    (event: any) => {
      const feature = event?.features?.[0];
      if (!feature) {
        console.log('[MapView] handleMarkerPress: No feature in event');
        return;
      }

      const markerId = feature.id || feature.properties?.id;
      const markerData = markers.find((m) => m.id === markerId);

      if (markerData) {
        console.log('[MapView] Marker pressed:', markerData.id, markerData.layerType);
        if (onMarkerPress) {
          onMarkerPress(markerData);
        }
      } else {
        console.log('[MapView] handleMarkerPress: Marker not found for id:', markerId);
      }
    },
    [markers, onMarkerPress]
  );

  /**
   * Convert road condition overlays to GeoJSON FeatureCollection for MapLibre.
   * Memoized to prevent unnecessary recalculations.
   * Note: Road conditions can contain thousands of coordinate points across all segments.
   */
  const overlaysGeoJSON = useMemo(() => {
    const geoJSON = {
      type: 'FeatureCollection' as const,
      features: overlays.map((overlay) => ({
        type: 'Feature' as const,
        id: overlay.id,
        geometry: {
          type: 'LineString' as const,
          coordinates: overlay.coordinates,
        },
        properties: {
          id: overlay.id,
          routeName: overlay.routeName,
          color: overlay.color,
          layerType: overlay.layerType,
        },
      })),
    };
    console.log('[MapView] Created overlaysGeoJSON:', {
      featureCount: geoJSON.features.length,
      sampleFeature: geoJSON.features[0],
    });
    return geoJSON;
  }, [overlays]);

  /**
   * Handle overlay press events.
   */
  const handleOverlayPress = (event: any): void => {
    const feature = event?.features?.[0];
    if (feature) {
      const overlayId = feature.id || feature.properties?.id;
      const overlayData = overlays.find((o) => o.id === overlayId);
      if (overlayData) {
        console.log('[MapView] Overlay pressed:', overlayData.id);
        if (onOverlayPress) {
          onOverlayPress(overlayData);
        }
      }
    }
  };

  return (
    <MLMapView
      style={[styles.map, style]}
      mapStyle={OPENFREEMAP_LIBERTY_STYLE_URL}
      onDidFinishLoadingMap={handleMapReady}
      onDidFailLoadingMap={handleMapError}
      logoEnabled={false}
      attributionEnabled={true}
      attributionPosition={{ bottom: 8, right: 8 }}
    >
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

      {/* Render overlays (road conditions and work zones) */}
      <ShapeSource id="overlays" shape={overlaysGeoJSON} onPress={handleOverlayPress}>
        <LineLayer
          id="overlay-lines"
          style={{
            lineColor: [
              'match',
              ['get', 'layerType'],
              'workZone',
              WORK_ZONE_COLOR,
              CO_BLUE, // default for roadCondition
            ],
            lineWidth: 4,
            lineOpacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </ShapeSource>

      {/* Render COtrip markers using PNG icons via SymbolLayer */}
      <ShapeSource id="markers" shape={markersGeoJSON} onPress={handleMarkerPress}>
        <SymbolLayer
          id="marker-symbols"
          style={{
            iconImage: [
              'match',
              ['get', 'layerType'],
              'incidents',
              'incidents',
              'weatherStations',
              'weatherStations',
              'snowPlows',
              'snowPlows',
              'plannedEvents',
              'plannedEvents',
              'dmsSigns',
              'dmsSigns',
              'incidents', // default
            ],
            iconSize: SYMBOL_ICON_SIZE,
            iconAllowOverlap: true,
            iconOpacity: ['case', ['get', 'isDimmed'], 0.5, 1],
          }}
        />
      </ShapeSource>

      {/* Load icon images for use in SymbolLayer */}
      <Images
        images={{
          incidents: LAYER_ICON_IMAGES.incidents,
          weatherStations: LAYER_ICON_IMAGES.weatherStations,
          snowPlows: LAYER_ICON_IMAGES.snowPlows,
          plannedEvents: LAYER_ICON_IMAGES.plannedEvents,
          dmsSigns: LAYER_ICON_IMAGES.dmsSigns,
        }}
       />
    </MLMapView>
  );
};

export const MapView = React.memo(MapViewInner);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
