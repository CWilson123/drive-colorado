/**
 * Drawer component - Slide-in navigation menu from the left.
 *
 * Displays app navigation, branding, and attribution.
 * Features Colorado flag inspired design elements.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import {
  CO_BLUE,
  CO_BLUE_LIGHT,
  CO_RED,
  CO_GOLD,
  CO_WHITE,
  CO_GRAY,
  CO_GRAY_DARK,
  CO_GRAY_LIGHT,
  BORDER_RADIUS_SM,
  BORDER_RADIUS_FULL,
  SPACING_XS,
  SPACING_SM,
  SPACING_MD,
  SPACING_LG,
  SPACING_XL,
  FONT_SIZE_XS,
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_SIZE_LG,
  FONT_WEIGHT_NORMAL,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_BOLD,
  Z_INDEX_MODAL,
  OPACITY_DISABLED,
} from '@/constants';
import type { DrawerProps, MenuItem } from './Drawer.types';

const DRAWER_WIDTH = 280;
const ANIMATION_DURATION = 300;
const OVERLAY_OPACITY = 0.4;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Menu items configuration.
 */
const MENU_ITEMS: MenuItem[] = [
  { id: 'about', label: 'About', icon: 'info' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'feedback', label: 'Send Feedback', icon: 'message-circle' },
];

const COMING_SOON_ITEMS: MenuItem[] = [
  { id: 'ski-planner', label: 'Ski Trip Planner', icon: 'home', disabled: true, badge: 'Coming Soon' },
  { id: 'favorites', label: 'Favorite Locations', icon: 'star', disabled: true, badge: 'Coming Soon' },
];

/**
 * Colorado flag inspired decoration element.
 */
const ColoradoDecoration: React.FC = () => (
  <View style={styles.decorationContainer}>
    <View style={styles.decorationOuter}>
      <View style={styles.decorationInner} />
    </View>
  </View>
);

/**
 * Individual menu item row.
 */
const MenuItemRow: React.FC<{
  item: MenuItem;
  onPress?: () => void;
}> = ({ item, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
    onPress={onPress}
    disabled={item.disabled}
    activeOpacity={0.7}
  >
    <Feather
      name={item.icon as any}
      size={20}
      color={item.disabled ? CO_GRAY : CO_GRAY_DARK}
    />
    <Text style={[styles.menuLabel, item.disabled && styles.menuLabelDisabled]}>
      {item.label}
    </Text>
    {item.badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

/**
 * Slide-in drawer navigation menu.
 *
 * Features:
 * - Dark overlay with tap-to-close
 * - Animated slide from left
 * - Colorado-themed header with gradient
 * - Menu items with Feather icons
 * - Coming soon items with badges
 * - Footer attribution
 *
 * @param props - Component props
 * @returns Rendered drawer or null when not visible
 */
export const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  onAboutPress,
  onSettingsPress,
  onFeedbackPress,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: OVERLAY_OPACITY,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleMenuPress = (id: string): void => {
    switch (id) {
      case 'about':
        onAboutPress?.();
        break;
      case 'settings':
        onSettingsPress?.();
        break;
      case 'feedback':
        onFeedbackPress?.();
        break;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Dark overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={[CO_BLUE, CO_BLUE_LIGHT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + SPACING_LG }]}
        >
          <ColoradoDecoration />
          <Text style={styles.title}>Drive Colorado</Text>
          <Text style={styles.subtitle}>Real-time road conditions</Text>
        </LinearGradient>

        {/* Menu items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onPress={() => handleMenuPress(item.id)}
            />
          ))}

          <View style={styles.divider} />

          {COMING_SOON_ITEMS.map((item) => (
            <MenuItemRow key={item.id} item={item} />
          ))}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING_MD }]}>
          <Text style={styles.footerText}>
            Data provided by CDOT COtrip
          </Text>
          <Text style={styles.footerText}>
            Maps © OpenStreetMap contributors
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: Z_INDEX_MODAL,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CO_BLUE,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: CO_WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    paddingHorizontal: SPACING_LG,
    paddingBottom: SPACING_LG,
  },
  decorationContainer: {
    marginBottom: SPACING_MD,
  },
  decorationOuter: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS_FULL,
    backgroundColor: CO_GOLD,
    borderWidth: 3,
    borderColor: CO_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorationInner: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS_FULL,
    backgroundColor: CO_WHITE,
  },
  title: {
    fontSize: FONT_SIZE_LG + 4,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_WHITE,
    marginBottom: SPACING_XS,
  },
  subtitle: {
    fontSize: FONT_SIZE_SM,
    fontWeight: FONT_WEIGHT_NORMAL,
    color: CO_WHITE,
    opacity: 0.85,
  },
  menuSection: {
    flex: 1,
    paddingTop: SPACING_MD,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING_MD,
    paddingHorizontal: SPACING_LG,
  },
  menuItemDisabled: {
    opacity: OPACITY_DISABLED,
  },
  menuLabel: {
    flex: 1,
    marginLeft: SPACING_MD,
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: CO_GRAY_DARK,
  },
  menuLabelDisabled: {
    color: CO_GRAY,
  },
  badge: {
    backgroundColor: CO_GRAY_LIGHT,
    paddingHorizontal: SPACING_SM,
    paddingVertical: SPACING_XS,
    borderRadius: BORDER_RADIUS_SM,
  },
  badgeText: {
    fontSize: FONT_SIZE_XS,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: CO_GRAY_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: CO_GRAY,
    marginVertical: SPACING_SM,
    marginHorizontal: SPACING_LG,
  },
  footer: {
    paddingHorizontal: SPACING_LG,
    borderTopWidth: 1,
    borderTopColor: CO_GRAY,
    paddingTop: SPACING_MD,
  },
  footerText: {
    fontSize: FONT_SIZE_XS,
    color: CO_GRAY_DARK,
    marginBottom: SPACING_XS,
  },
});
