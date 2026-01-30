/**
 * LayerDropdown component - Dropdown panel for toggling map layers.
 *
 * Displays a list of map layers with toggle switches.
 * Animates in/out with fade and scale effects.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY,
  CO_GRAY_DARK,
  BORDER_RADIUS_LG,
  BORDER_RADIUS_MD,
  SPACING_SM,
  SPACING_MD,
  SPACING_LG,
  FONT_SIZE_XS,
  FONT_SIZE_MD,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  Z_INDEX_DROPDOWN,
} from '@/constants';
import type { LayerDropdownProps, MapLayer } from './LayerDropdown.types';

const ANIMATION_DURATION = 200;
const ICON_SIZE = 36;
const TOP_BAR_HEIGHT = 60;

/**
 * Individual layer item with icon, name, and toggle.
 */
const LayerItem: React.FC<{
  layer: MapLayer;
  onToggle: () => void;
}> = ({ layer, onToggle }) => (
  <View style={styles.layerItem}>
    <View style={[styles.iconContainer, { backgroundColor: layer.iconBackground }]}>
      <Text style={styles.iconEmoji}>{layer.icon}</Text>
    </View>
    <Text style={styles.layerName}>{layer.name}</Text>
    <Switch
      value={layer.enabled}
      onValueChange={onToggle}
      trackColor={{ false: CO_GRAY, true: CO_BLUE }}
      thumbColor={CO_WHITE}
      ios_backgroundColor={CO_GRAY}
    />
  </View>
);

/**
 * Dropdown panel for map layer controls.
 *
 * Features:
 * - Positioned below top bar on right side
 * - Animated fade and scale transitions
 * - Blue header with "MAP LAYERS" title
 * - List of toggleable layers with emoji icons
 * - Tap outside to close
 *
 * @param props - Component props
 * @returns Rendered dropdown or null when not visible
 */
export const LayerDropdown: React.FC<LayerDropdownProps> = ({
  visible,
  onClose,
  layers,
  onToggleLayer,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.dropdown,
          {
            top: insets.top + TOP_BAR_HEIGHT + SPACING_SM,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>MAP LAYERS</Text>
        </View>

        <View style={styles.layerList}>
          {layers.map((layer) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              onToggle={() => onToggleLayer(layer.id)}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: Z_INDEX_DROPDOWN,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdown: {
    position: 'absolute',
    right: SPACING_MD,
    backgroundColor: CO_WHITE,
    borderRadius: BORDER_RADIUS_LG,
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: CO_BLUE,
    paddingVertical: SPACING_SM,
    paddingHorizontal: SPACING_MD,
  },
  headerText: {
    color: CO_WHITE,
    fontSize: FONT_SIZE_XS,
    fontWeight: FONT_WEIGHT_BOLD,
    letterSpacing: 1,
  },
  layerList: {
    paddingVertical: SPACING_SM,
  },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING_SM,
    paddingHorizontal: SPACING_MD,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: BORDER_RADIUS_MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  layerName: {
    flex: 1,
    marginLeft: SPACING_SM,
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: CO_GRAY_DARK,
  },
});

/**
 * Default map layers configuration.
 * Use this as initial state when implementing the layer system.
 */
export const DEFAULT_MAP_LAYERS: MapLayer[] = [
  {
    id: 'road-conditions',
    name: 'Road Conditions',
    icon: '🛣️',
    iconBackground: '#E0F2FE',
    enabled: true,
  },
  {
    id: 'traffic-cameras',
    name: 'Traffic Cameras',
    icon: '📷',
    iconBackground: '#FCE7F3',
    enabled: true,
  },
  {
    id: 'weather-alerts',
    name: 'Weather Alerts',
    icon: '🌦️',
    iconBackground: '#FFEDD5',
    enabled: true,
  },
  {
    id: 'snowplows',
    name: 'Snowplows',
    icon: '🚜',
    iconBackground: '#DCFCE7',
    enabled: false,
  },
  {
    id: 'incidents',
    name: 'Incidents',
    icon: '🚨',
    iconBackground: '#FEE2E2',
    enabled: true,
  },
];
