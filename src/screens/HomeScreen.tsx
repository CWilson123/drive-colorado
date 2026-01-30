/**
 * HomeScreen - Main screen displaying the full-screen map of Colorado.
 *
 * This screen serves as the primary entry point for the app, showing an
 * interactive map centered on Colorado. Future enhancements will include
 * overlay UI elements such as bottom sheets, search, and action buttons.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MapView } from '../components/Map';

/**
 * Props for the HomeScreen component.
 * Currently empty but defined for future extensibility.
 */
interface HomeScreenProps {
  // Future props: navigation, route, etc.
}

/**
 * Home screen component with full-screen map.
 *
 * Features:
 * - Full-screen MapView component
 * - SafeAreaView for notched device support
 * - Prepared for overlay UI elements (bottom sheet, buttons, etc.)
 *
 * @returns Rendered home screen
 */
export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  /**
   * Handle map initialization completion.
   */
  const handleMapReady = (): void => {
    setIsMapReady(true);
    console.log('HomeScreen: Map is ready');
  };

  /**
   * Handle map loading errors.
   */
  const handleMapError = (error: Error): void => {
    console.error('HomeScreen: Map error:', error.message);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Full-screen map */}
        <MapView
          style={styles.map}
          onMapReady={handleMapReady}
          onMapError={handleMapError}
        />

        {/* SafeAreaView overlay for future UI elements */}
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          {/* Future UI elements will go here:
              - Search bar at top
              - Bottom sheet with route info
              - Floating action buttons
              - Legend/layer toggles
          */}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
