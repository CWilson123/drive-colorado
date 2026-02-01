/**
 * LoadingOverlay component - Semi-transparent overlay with loading spinner.
 *
 * Displays during initial data loading, positioned below TopBar but above map.
 * Auto-hides when data finishes loading.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY_DARK,
  SPACING_MD,
  FONT_SIZE_MD,
  FONT_WEIGHT_MEDIUM,
  Z_INDEX_MODAL,
} from '@/constants';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

const ANIMATION_DURATION = 200;

/**
 * Loading overlay component with fade animation.
 *
 * Features:
 * - Semi-transparent backdrop
 * - Centered loading spinner
 * - Optional loading message
 * - Fade in/out animation
 * - Positioned above map but below TopBar
 *
 * @param props - Component props
 * @returns Rendered overlay or null when not visible
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading map data...',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible && fadeAnim.__getValue() === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={CO_BLUE} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: Z_INDEX_MODAL - 1,
  },
  content: {
    alignItems: 'center',
    padding: SPACING_MD,
  },
  message: {
    marginTop: SPACING_MD,
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: CO_GRAY_DARK,
    textAlign: 'center',
  },
});
