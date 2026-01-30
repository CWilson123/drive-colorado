/**
 * Drive Colorado - Main Application Entry Point
 *
 * A React Native application for exploring scenic driving routes in Colorado.
 * Built with Expo and MapLibre for native map functionality.
 */

import React from 'react';
import { HomeScreen } from './src/screens/HomeScreen';

/**
 * Root application component.
 * Currently renders HomeScreen directly; will be expanded with navigation
 * as additional screens are added.
 */
export default function App(): React.JSX.Element {
  return <HomeScreen />;
}
