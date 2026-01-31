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
  CO_BLACK,
  BORDER_RADIUS_LG,
  SPACING_MD,
  SPACING_SM,
  BOTTOM_INFO_BAR_HEIGHT,
  MY_LOCATION_BUTTON_SIZE,
  MY_LOCATION_ICON_SIZE,
  MY_LOCATION_BUTTON_BOTTOM_OFFSET,
  MY_LOCATION_BUTTON_SHADOW_OFFSET,
  MY_LOCATION_BUTTON_SHADOW_OPACITY,
  MY_LOCATION_BUTTON_SHADOW_RADIUS,
  MY_LOCATION_BUTTON_ELEVATION,
} from '@/constants';
import type { MyLocationButtonProps } from './MyLocationButton.types';

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
          bottom:
            insets.bottom +
            SPACING_MD +
            BOTTOM_INFO_BAR_HEIGHT +
            SPACING_SM +
            MY_LOCATION_BUTTON_BOTTOM_OFFSET,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Center on my location"
      accessibilityRole="button"
    >
      <Feather name="crosshair" size={MY_LOCATION_ICON_SIZE} color={CO_BLUE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: SPACING_MD,
    width: MY_LOCATION_BUTTON_SIZE,
    height: MY_LOCATION_BUTTON_SIZE,
    backgroundColor: CO_WHITE,
    borderRadius: BORDER_RADIUS_LG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CO_BLACK,
    shadowOffset: MY_LOCATION_BUTTON_SHADOW_OFFSET,
    shadowOpacity: MY_LOCATION_BUTTON_SHADOW_OPACITY,
    shadowRadius: MY_LOCATION_BUTTON_SHADOW_RADIUS,
    elevation: MY_LOCATION_BUTTON_ELEVATION,
  },
});
