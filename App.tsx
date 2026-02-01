/**
 * Drive Colorado - Main Application Entry Point
 *
 * A React Native application for exploring scenic driving routes in Colorado.
 * Built with Expo and MapLibre for native map functionality.
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';

/**
 * Root application component.
 * Wrapped in GestureHandlerRootView to enable gesture handling throughout the app.
 * Currently renders HomeScreen directly; will be expanded with navigation
 * as additional screens are added.
 */
export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeScreen />
    </GestureHandlerRootView>
  );
}
