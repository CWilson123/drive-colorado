/**
 * TopBar component - Main navigation bar with menu, search, and layer controls.
 *
 * Positioned at the top of the screen with safe area padding.
 * Contains a hamburger menu button, search input, and layer toggle button.
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY_LIGHT,
  CO_GRAY_DARK,
  BORDER_RADIUS_LG,
  BORDER_RADIUS_MD,
  SPACING_SM,
  SPACING_MD,
  FONT_SIZE_MD,
} from '@/constants';
import type { TopBarProps } from './TopBar.types';

const ICON_SIZE = 24;
const BUTTON_SIZE = 44;

/**
 * Main navigation bar component.
 *
 * Features:
 * - Safe area aware positioning
 * - Hamburger menu button (left)
 * - Search input with placeholder (center)
 * - Layer toggle button (right)
 *
 * @param props - Component props
 * @returns Rendered top bar
 */
export const TopBar: React.FC<TopBarProps> = ({
  onMenuPress,
  onLayerPress,
  onSearchChange,
  onSearchSubmit,
  searchValue,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const currentValue = searchValue ?? internalValue;

  const handleTextChange = (text: string): void => {
    if (searchValue === undefined) {
      setInternalValue(text);
    }
    onSearchChange?.(text);
  };

  const handleSubmit = (): void => {
    onSearchSubmit?.(currentValue);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING_SM,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Feather name="menu" size={ICON_SIZE} color={CO_BLUE} />
        </TouchableOpacity>

        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search or Drive Colorado"
            placeholderTextColor={CO_GRAY_DARK}
            value={currentValue}
            onChangeText={handleTextChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.searchIconContainer}>
            <Feather name="search" size={ICON_SIZE} color={CO_GRAY_DARK} />
          </View>
        </View>

        {/* Layer Button */}
        <TouchableOpacity
          style={styles.layerButton}
          onPress={onLayerPress}
          accessibilityLabel="Toggle map layers"
          accessibilityRole="button"
        >
          <Feather name="layers" size={ICON_SIZE} color={CO_WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: SPACING_MD,
    paddingBottom: SPACING_SM,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CO_WHITE,
    borderRadius: BORDER_RADIUS_LG,
    paddingHorizontal: SPACING_SM,
    paddingVertical: SPACING_SM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  menuButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS_MD,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CO_GRAY_LIGHT,
    borderRadius: BORDER_RADIUS_MD,
    marginHorizontal: SPACING_SM,
    paddingHorizontal: SPACING_MD,
    height: BUTTON_SIZE,
  },
  searchContainerFocused: {
    backgroundColor: CO_WHITE,
    borderWidth: 1,
    borderColor: CO_BLUE,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE_MD,
    color: CO_BLUE,
    paddingVertical: 0,
  },
  searchIconContainer: {
    marginLeft: SPACING_SM,
  },
  layerButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CO_BLUE,
    borderRadius: BORDER_RADIUS_MD,
  },
});
