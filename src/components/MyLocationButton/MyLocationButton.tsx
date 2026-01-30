/**
 * MyLocationButton component - Floating button to center map on user location.
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  CO_BLUE,
  CO_WHITE,
  BORDER_RADIUS_LG,
  SPACING_MD,
} from '@/constants';
import type { MyLocationButtonProps } from './MyLocationButton.types';

const BUTTON_SIZE = 48;
const ICON_SIZE = 24;

/**
 * Floating button for centering the map on the user's location.
 *
 * @param props - Component props
 * @returns Rendered button
 */
export const MyLocationButton: React.FC<MyLocationButtonProps> = ({
  onPress,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          bottom: insets.bottom + SPACING_MD,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Center on my location"
      accessibilityRole="button"
    >
      <Feather name="crosshair" size={ICON_SIZE} color={CO_BLUE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: SPACING_MD,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: CO_WHITE,
    borderRadius: BORDER_RADIUS_LG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
