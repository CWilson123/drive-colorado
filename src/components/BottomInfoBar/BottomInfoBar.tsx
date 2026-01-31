/**
 * BottomInfoBar component - Displays selected road/feature information.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY_DARK,
  CO_RED,
  CO_GOLD,
  CO_BLACK,
  COLOR_SUCCESS,
  BORDER_RADIUS_LG,
  SPACING_SM,
  SPACING_MD,
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_NORMAL,
  BOTTOM_INFO_BAR_HEIGHT,
  BOTTOM_INFO_BAR_STATUS_DOT_SIZE,
  BOTTOM_INFO_BAR_TITLE_MARGIN_BOTTOM,
  BOTTOM_INFO_BAR_SHADOW_OFFSET,
  BOTTOM_INFO_BAR_SHADOW_OPACITY,
  BOTTOM_INFO_BAR_SHADOW_RADIUS,
  BOTTOM_INFO_BAR_ELEVATION,
} from '@/constants';
import type { BottomInfoBarProps, StatusLevel } from './BottomInfoBar.types';

/**
 * Maps status level to indicator color.
 */
const STATUS_COLORS: Record<StatusLevel, string> = {
  good: COLOR_SUCCESS,
  warning: CO_GOLD,
  severe: CO_RED,
};

/**
 * Bottom info bar for displaying selected road/feature details.
 *
 * @param props - Component props
 * @returns Rendered info bar or null when not visible
 */
export const BottomInfoBar: React.FC<BottomInfoBarProps> = ({
  visible,
  status,
  title,
  subtitle,
  onPress,
  style,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.9 } : {};

  return (
    <Container
      style={[
        styles.container,
        {
          bottom: insets.bottom + SPACING_MD,
        },
        style,
      ]}
      {...containerProps}
    >
      <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status] }]} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING_MD,
    right: SPACING_MD,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CO_WHITE,
    borderRadius: BORDER_RADIUS_LG,
    minHeight: BOTTOM_INFO_BAR_HEIGHT,
    paddingVertical: SPACING_MD,
    paddingHorizontal: SPACING_MD,
    shadowColor: CO_BLACK,
    shadowOffset: BOTTOM_INFO_BAR_SHADOW_OFFSET,
    shadowOpacity: BOTTOM_INFO_BAR_SHADOW_OPACITY,
    shadowRadius: BOTTOM_INFO_BAR_SHADOW_RADIUS,
    elevation: BOTTOM_INFO_BAR_ELEVATION,
  },
  statusDot: {
    width: BOTTOM_INFO_BAR_STATUS_DOT_SIZE,
    height: BOTTOM_INFO_BAR_STATUS_DOT_SIZE,
    borderRadius: BOTTOM_INFO_BAR_STATUS_DOT_SIZE / 2,
    marginRight: SPACING_SM,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLUE,
    marginBottom: BOTTOM_INFO_BAR_TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: FONT_SIZE_SM,
    fontWeight: FONT_WEIGHT_NORMAL,
    color: CO_GRAY_DARK,
  },
});
