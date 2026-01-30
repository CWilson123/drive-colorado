/**
 * HomeScreen - Main screen displaying the full-screen map of Colorado.
 *
 * This screen serves as the primary entry point for the app, showing an
 * interactive map with overlay UI components for navigation and information.
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
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
  DEFAULT_MAP_LAYERS,
} from '@/components';
import type { MapLayer, StatusLevel } from '@/components';

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
  // Map state
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLayerDropdownOpen, setIsLayerDropdownOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // Layer state
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_MAP_LAYERS);

  // Selected feature state (mock data for testing)
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
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  }, []);

  /**
   * Handle my location button press.
   */
  const handleMyLocationPress = useCallback((): void => {
    closeOverlays();
    // TODO: Trigger map to center on user location
    console.log('Center on my location');
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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Full-screen map (bottom layer) */}
        <TouchableWithoutFeedback onPress={handleMapPress}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              onMapReady={handleMapReady}
              onMapError={handleMapError}
            />
          </View>
        </TouchableWithoutFeedback>

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
          layers={layers}
          onToggleLayer={handleToggleLayer}
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
