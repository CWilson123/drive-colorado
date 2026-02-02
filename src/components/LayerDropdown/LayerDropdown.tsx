/**
 * LayerDropdown component - Dropdown panel for toggling map layers.
 *
 * Displays a list of map layers with toggle switches.
 * Animates in/out with fade and scale effects.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY,
  CO_GRAY_DARK,
  BORDER_RADIUS_LG,
  SPACING_SM,
  SPACING_MD,
  SPACING_LG,
  FONT_SIZE_XS,
  FONT_SIZE_MD,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  Z_INDEX_DROPDOWN,
  LayerIcon,
  LAYER_ICON_SIZE_MD,
} from '@/constants';
import type { LayerDropdownProps, MapLayer } from './LayerDropdown.types';

const ANIMATION_DURATION = 200;
const TOP_BAR_HEIGHT = 60;

/**
 * Available map layers configuration.
 * Matches COtrip data endpoints.
 * Icons and colors are derived from LayerIcon config via layer id.
 * Order: Road Conditions, Incidents, Work Zones, Planned Events, Weather Stations, Snow Plows, DMS Signs
 */
const AVAILABLE_LAYERS: MapLayer[] = [
  {
    id: 'roadConditions',
    name: 'Road Conditions',
    enabled: false, // Will be overridden by enabledLayers prop
  },
  {
    id: 'incidents',
    name: 'Traffic Incidents',
    enabled: false,
  },
  {
    id: 'workZones',
    name: 'Work Zones',
    enabled: false,
  },
  {
    id: 'plannedEvents',
    name: 'Planned Events',
    enabled: false,
  },
  {
    id: 'weatherStations',
    name: 'Weather Stations',
    enabled: false,
  },
  {
    id: 'snowPlows',
    name: 'Snow Plows',
    enabled: false,
  },
  {
    id: 'dmsSigns',
    name: 'Message Signs',
    enabled: false,
  },
];

/**
 * Formats last updated time as relative string (e.g., "Updated 2 min ago")
 */
const formatLastUpdated = (date: Date | null): string => {
  if (!date) return 'Never updated';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Updated just now';
  if (diffMinutes === 1) return 'Updated 1 min ago';
  if (diffMinutes < 60) return `Updated ${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return 'Updated 1 hour ago';
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;

  return 'Updated over 1 day ago';
};

/**
 * Individual layer item with icon, name, and toggle.
 */
const LayerItem: React.FC<{
  layer: MapLayer;
  onToggle: () => void;
}> = ({ layer, onToggle }) => {
  return (
    <View style={styles.layerItem}>
      <View style={styles.iconContainer}>
        <LayerIcon layerKey={layer.id} size={LAYER_ICON_SIZE_MD} />
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
};

/**
 * Dropdown panel for map layer controls.
 *
 * Features:
 * - Positioned below top bar on right side
 * - Animated fade and scale transitions
 * - Blue header with "MAP LAYERS" title
 * - List of toggleable layers with map icons
 * - Tap outside to close
 *
 * @param props - Component props
 * @returns Rendered dropdown or null when not visible
 */
export const LayerDropdown: React.FC<LayerDropdownProps> = ({
  visible,
  onClose,
  enabledLayers,
  onToggleLayer,
  isLoading = false,
  lastUpdated = null,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Merge enabled state with layer definitions
  const layers = useMemo(
    () =>
      AVAILABLE_LAYERS.map((layer) => ({
        ...layer,
        enabled: enabledLayers[layer.id] ?? false,
      })),
    [enabledLayers]
  );

  // Format last updated time
  const lastUpdatedText = useMemo(
    () => formatLastUpdated(lastUpdated),
    [lastUpdated]
  );

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
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>MAP LAYERS</Text>
            {isLoading && (
              <ActivityIndicator size="small" color={CO_WHITE} style={styles.loadingIndicator} />
            )}
          </View>
          <Text style={styles.lastUpdatedText}>{lastUpdatedText}</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: CO_WHITE,
    fontSize: FONT_SIZE_XS,
    fontWeight: FONT_WEIGHT_BOLD,
    letterSpacing: 1,
  },
  loadingIndicator: {
    marginLeft: SPACING_SM,
  },
  lastUpdatedText: {
    color: CO_WHITE,
    fontSize: 10,
    marginTop: 2,
    opacity: 0.8,
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
    width: LAYER_ICON_SIZE_MD,
    height: LAYER_ICON_SIZE_MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerName: {
    flex: 1,
    marginLeft: SPACING_SM,
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: CO_GRAY_DARK,
  },
});
