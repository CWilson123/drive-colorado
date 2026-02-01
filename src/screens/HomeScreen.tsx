/**
 * HomeScreen - Main screen displaying the full-screen map of Colorado.
 *
 * This screen serves as the primary entry point for the app, showing an
 * interactive map with overlay UI components for navigation and information.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  MapView,
  TopBar,
  LayerDropdown,
  Drawer,
  MyLocationButton,
  BottomInfoBar,
  AboutModal,
  LoadingOverlay,
  ErrorToast,
  MarkerDetailSheet,
} from '@/components';
import type { StatusLevel } from '@/components';
import { useMapLayers } from '@/hooks/useMapLayers';
import type { MapMarkerData, MapOverlayData } from '@/types';

/**
 * Selected info data for the bottom bar.
 */
interface SelectedInfo {
  title: string;
  subtitle: string;
  status: StatusLevel;
}

/**
 * Props for the HomeScreen component.
 */
interface HomeScreenProps {
  // Future props: navigation, route, etc.
}

/**
 * Home screen component with full-screen map and overlay UI.
 *
 * Features:
 * - Full-screen MapView component
 * - TopBar with search, menu, and layer controls
 * - Slide-in navigation drawer
 * - Layer selection dropdown
 * - My location floating button
 * - Bottom info bar for selected features
 *
 * @returns Rendered home screen
 */
export const HomeScreen: React.FC<HomeScreenProps> = () => {
  // Get layer data from useMapLayers hook
  const {
    markers,
    overlays,
    enabledLayers,
    isLoading,
    lastUpdated,
    error,
    toggleLayer,
    refreshData,
  } = useMapLayers();

  // Map state
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLayerDropdownOpen, setIsLayerDropdownOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // Loading and error state
  const [showInitialLoading, setShowInitialLoading] = useState<boolean>(true);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

  // Map control state
  const [centerOnUserTrigger, setCenterOnUserTrigger] = useState<number>(0);

  // Selected marker/overlay state for detail sheet
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<MapOverlayData | null>(null);

  // Selected feature state (mock data for testing - kept for BottomInfoBar)
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>({
    title: 'I-70 Westbound',
    subtitle: 'Clear conditions - No delays',
    status: 'good',
  });

  /**
   * Handle map initialization completion.
   */
  const handleMapReady = useCallback((): void => {
    setIsMapReady(true);
    console.log('HomeScreen: Map is ready');
  }, []);

  /**
   * Handle map loading errors.
   */
  const handleMapError = useCallback((error: Error): void => {
    console.error('HomeScreen: Map error:', error.message);
  }, []);

  /**
   * Close all dropdowns and overlays.
   */
  const closeOverlays = useCallback((): void => {
    setIsLayerDropdownOpen(false);
  }, []);

  /**
   * Handle map press - close overlays but not drawer.
   */
  const handleMapPress = useCallback((): void => {
    closeOverlays();
    // Clear selected info when tapping map (optional behavior)
    // setSelectedInfo(null);
  }, [closeOverlays]);

  /**
   * Toggle the navigation drawer.
   */
  const handleMenuPress = useCallback((): void => {
    closeOverlays();
    setIsDrawerOpen(true);
  }, [closeOverlays]);

  /**
   * Close the navigation drawer.
   */
  const handleDrawerClose = useCallback((): void => {
    setIsDrawerOpen(false);
  }, []);

  /**
   * Toggle the layer dropdown.
   */
  const handleLayerPress = useCallback((): void => {
    setIsLayerDropdownOpen((prev) => !prev);
  }, []);

  /**
   * Close the layer dropdown.
   */
  const handleLayerDropdownClose = useCallback((): void => {
    setIsLayerDropdownOpen(false);
  }, []);

  /**
   * Toggle a layer's enabled state.
   */
  const handleToggleLayer = useCallback((id: string): void => {
    toggleLayer(id as any); // Cast to LayerType
  }, [toggleLayer]);

  /**
   * Handle my location button press.
   */
  const handleMyLocationPress = useCallback((): void => {
    closeOverlays();
    // Trigger map to center on user location by incrementing the trigger
    setCenterOnUserTrigger((prev) => prev + 1);
  }, [closeOverlays]);

  /**
   * Handle search text changes.
   */
  const handleSearchChange = useCallback((text: string): void => {
    console.log('Search:', text);
  }, []);

  /**
   * Handle search submission.
   */
  const handleSearchSubmit = useCallback((text: string): void => {
    closeOverlays();
    console.log('Search submitted:', text);
  }, [closeOverlays]);

  /**
   * Handle bottom info bar press.
   */
  const handleInfoBarPress = useCallback((): void => {
    console.log('Info bar pressed - show details');
  }, []);

  /**
   * Handle drawer menu item presses.
   */
  const handleAboutPress = useCallback((): void => {
    handleDrawerClose();
    setIsAboutModalOpen(true);
  }, [handleDrawerClose]);

  const handleAboutModalClose = useCallback((): void => {
    setIsAboutModalOpen(false);
  }, []);

  const handleSettingsPress = useCallback((): void => {
    handleDrawerClose();
    console.log('Settings pressed');
  }, [handleDrawerClose]);

  const handleFeedbackPress = useCallback((): void => {
    handleDrawerClose();
    console.log('Feedback pressed');
  }, [handleDrawerClose]);

  /**
   * Handle error toast retry action.
   */
  const handleErrorRetry = useCallback(async (): Promise<void> => {
    setShowErrorToast(false);
    await refreshData();
  }, [refreshData]);

  /**
   * Dismiss error toast.
   */
  const handleErrorDismiss = useCallback((): void => {
    setShowErrorToast(false);
  }, []);

  /**
   * Handle marker press on map.
   */
  const handleMarkerPress = useCallback((marker: MapMarkerData): void => {
    console.log('[HomeScreen] Marker pressed, opening detail sheet');
    setSelectedMarker(marker);
    setSelectedOverlay(null); // Clear overlay if switching to marker
  }, []);

  /**
   * Handle overlay press on map.
   */
  const handleOverlayPress = useCallback((overlay: MapOverlayData): void => {
    console.log('[HomeScreen] Overlay pressed, opening detail sheet');
    setSelectedOverlay(overlay);
    setSelectedMarker(null); // Clear marker if switching to overlay
  }, []);

  /**
   * Close marker detail sheet.
   */
  const handleDetailSheetClose = useCallback((): void => {
    setSelectedMarker(null);
    setSelectedOverlay(null);
  }, []);

  /**
   * Hide initial loading overlay once data loads.
   */
  useEffect(() => {
    if (lastUpdated && showInitialLoading) {
      setShowInitialLoading(false);
    }
  }, [lastUpdated, showInitialLoading]);

  /**
   * Show error toast when error occurs.
   */
  useEffect(() => {
    if (error && !isLoading) {
      setShowErrorToast(true);
    }
  }, [error, isLoading]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Full-screen map (bottom layer) */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            onMapReady={handleMapReady}
            onMapError={handleMapError}
            centerOnUserTrigger={centerOnUserTrigger}
            overlays={overlays}
            markers={markers}
            onMarkerPress={handleMarkerPress}
            onOverlayPress={handleOverlayPress}
          />
        </View>

        {/* Bottom Info Bar */}
        <BottomInfoBar
          visible={selectedInfo !== null}
          status={selectedInfo?.status ?? 'good'}
          title={selectedInfo?.title ?? ''}
          subtitle={selectedInfo?.subtitle ?? ''}
          onPress={handleInfoBarPress}
        />

        {/* My Location Button */}
        <MyLocationButton onPress={handleMyLocationPress} />

        {/* Top Bar */}
        <TopBar
          onMenuPress={handleMenuPress}
          onLayerPress={handleLayerPress}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Layer Dropdown (conditionally visible) */}
        <LayerDropdown
          visible={isLayerDropdownOpen}
          onClose={handleLayerDropdownClose}
          enabledLayers={enabledLayers}
          onToggleLayer={handleToggleLayer}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
        />

        {/* Navigation Drawer (top layer) */}
        <Drawer
          visible={isDrawerOpen}
          onClose={handleDrawerClose}
          onAboutPress={handleAboutPress}
          onSettingsPress={handleSettingsPress}
          onFeedbackPress={handleFeedbackPress}
        />

        {/* About Modal */}
        <AboutModal
          visible={isAboutModalOpen}
          onClose={handleAboutModalClose}
        />

        {/* Loading Overlay (initial data load) */}
        <LoadingOverlay
          visible={showInitialLoading && isLoading}
          message="Loading map data..."
        />

        {/* Error Toast (data fetch failures) */}
        <ErrorToast
          visible={showErrorToast}
          message={error || 'Failed to load data'}
          onPress={handleErrorRetry}
          onDismiss={handleErrorDismiss}
        />

        {/* Marker Detail Sheet */}
        <MarkerDetailSheet
          visible={!!(selectedMarker || selectedOverlay)}
          marker={selectedMarker}
          overlay={selectedOverlay}
          onClose={handleDetailSheetClose}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
  },
});
