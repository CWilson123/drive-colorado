/**
 * ErrorToast component - Small toast notification for errors.
 *
 * Displays briefly at the bottom of the screen when data fetch fails.
 * Auto-dismisses after 5 seconds, or tap to retry.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CO_RED,
  CO_WHITE,
  BORDER_RADIUS_MD,
  SPACING_SM,
  SPACING_MD,
  FONT_SIZE_SM,
  FONT_WEIGHT_MEDIUM,
  Z_INDEX_MODAL,
  BOTTOM_INFO_BAR_HEIGHT,
} from '@/constants';
import type { ErrorToastProps } from './ErrorToast.types';

const ANIMATION_DURATION = 300;
const DEFAULT_DURATION = 5000;

/**
 * Error toast notification component.
 *
 * Features:
 * - Slides up from bottom with animation
 * - Red background with white text
 * - Auto-dismisses after specified duration
 * - Tap to trigger retry action
 * - Positioned above bottom info bar
 *
 * @param props - Component props
 * @returns Rendered toast or null when not visible
 */
export const ErrorToast: React.FC<ErrorToastProps> = ({
  visible,
  message,
  onPress,
  onDismiss,
  duration = DEFAULT_DURATION,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after duration
      timeoutRef.current = setTimeout(() => {
        if (onDismiss) {
          onDismiss();
        }
      }, duration);
    } else {
      // Slide down and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Cleanup timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, translateY, opacity, onDismiss]);

  if (!visible && opacity.__getValue() === 0) {
    return null;
  }

  const handlePress = (): void => {
    if (onPress) {
      onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + BOTTOM_INFO_BAR_HEIGHT + SPACING_MD,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        {onPress && <Text style={styles.actionText}>Tap to retry</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING_MD,
    right: SPACING_MD,
    zIndex: Z_INDEX_MODAL,
  },
  toast: {
    backgroundColor: CO_RED,
    borderRadius: BORDER_RADIUS_MD,
    paddingVertical: SPACING_SM,
    paddingHorizontal: SPACING_MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: SPACING_SM,
  },
  message: {
    flex: 1,
    color: CO_WHITE,
    fontSize: FONT_SIZE_SM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  actionText: {
    color: CO_WHITE,
    fontSize: FONT_SIZE_SM - 2,
    marginTop: 4,
    opacity: 0.8,
    textAlign: 'center',
  },
});
