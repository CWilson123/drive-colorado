/**
 * AboutModal component - Displays app information, attributions, and legal disclaimers.
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  CO_BLUE,
  CO_WHITE,
  CO_GRAY_DARK,
  CO_GRAY_LIGHT,
  BORDER_RADIUS_LG,
  SPACING_MD,
  SPACING_LG,
  SPACING_XL,
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_SIZE_LG,
  FONT_SIZE_XL,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_SEMIBOLD,
  FONT_WEIGHT_NORMAL,
} from '@/constants';
import type { AboutModalProps } from './AboutModal.types';

const CDOT_DISCLAIMER = `The data made available here has been modified for use from its original source, which is the State of Colorado, Department of Transportation (CDOT). THE STATE OF COLORADO AND CDOT MAKES NO REPRESENTATIONS OR WARRANTY AS TO THE COMPLETENESS, ACCURACY, TIMELINESS, OR CONTENT OF ANY DATA MADE AVAILABLE THROUGH THIS SITE. THE STATE OF COLORADO AND CDOT EXPRESSLY DISCLAIM ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE STATE OF COLORADO AND CDOT SHALL ASSUME NO LIABILITY FOR ANY ERRORS, OMISSIONS, OR INACCURACIES IN THE DATA PROVIDED REGARDLESS OF HOW CAUSED.`;

const OSM_ATTRIBUTION = 'Map data © OpenStreetMap contributors';

/**
 * About modal displaying app information and legal attributions.
 *
 * Features:
 * - App description and version
 * - CDOT data disclaimer
 * - OpenStreetMap attribution
 * - Scrollable content
 *
 * @param props - Component props
 * @returns Rendered modal or null when not visible
 */
export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + SPACING_MD,
            },
          ]}
        >
          <Text style={styles.headerTitle}>About</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Feather name="x" size={24} color={CO_WHITE} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + SPACING_XL,
            },
          ]}
        >
          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.appTitle}>Drive Colorado</Text>
            <Text style={styles.appSubtitle}>Real-time Road Conditions</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              Drive Colorado provides real-time road condition information, traffic camera feeds,
              weather alerts, and incident reports across the state of Colorado. Stay informed
              about road conditions before and during your journey.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureItem}>
              <Feather name="map" size={18} color={CO_BLUE} style={styles.featureIcon} />
              <Text style={styles.featureText}>Interactive map of Colorado</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="alert-circle" size={18} color={CO_BLUE} style={styles.featureIcon} />
              <Text style={styles.featureText}>Real-time road conditions</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="camera" size={18} color={CO_BLUE} style={styles.featureIcon} />
              <Text style={styles.featureText}>Live traffic cameras</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="cloud" size={18} color={CO_BLUE} style={styles.featureIcon} />
              <Text style={styles.featureText}>Weather alerts and forecasts</Text>
            </View>
          </View>

          {/* Data Attribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Attribution</Text>
            <View style={styles.attributionBox}>
              <Text style={styles.attributionTitle}>Colorado Department of Transportation (CDOT)</Text>
              <Text style={styles.attributionText}>
                Road conditions, traffic cameras, and incident data provided by CDOT COtrip.
              </Text>
            </View>
            <View style={styles.attributionBox}>
              <Text style={styles.attributionTitle}>OpenStreetMap</Text>
              <Text style={styles.attributionText}>{OSM_ATTRIBUTION}</Text>
            </View>
          </View>

          {/* Legal Disclaimer */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal Disclaimer</Text>
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>{CDOT_DISCLAIMER}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This app is not affiliated with or endorsed by the State of Colorado or CDOT.
            </Text>
            <Text style={styles.footerText}>
              For official road conditions, visit COtrip.org
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CO_WHITE,
  },
  header: {
    backgroundColor: CO_BLUE,
    paddingHorizontal: SPACING_LG,
    paddingBottom: SPACING_MD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FONT_SIZE_XL,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_WHITE,
  },
  closeButton: {
    padding: SPACING_MD,
    marginRight: -SPACING_MD,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING_LG,
  },
  section: {
    marginBottom: SPACING_XL,
  },
  appTitle: {
    fontSize: FONT_SIZE_XL + 4,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLUE,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: FONT_SIZE_LG,
    fontWeight: FONT_WEIGHT_NORMAL,
    color: CO_GRAY_DARK,
    marginBottom: SPACING_MD,
  },
  version: {
    fontSize: FONT_SIZE_SM,
    color: CO_GRAY_DARK,
  },
  sectionTitle: {
    fontSize: FONT_SIZE_LG,
    fontWeight: FONT_WEIGHT_SEMIBOLD,
    color: CO_BLUE,
    marginBottom: SPACING_MD,
  },
  bodyText: {
    fontSize: FONT_SIZE_MD,
    lineHeight: 24,
    color: CO_GRAY_DARK,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING_MD,
  },
  featureIcon: {
    marginRight: SPACING_MD,
  },
  featureText: {
    fontSize: FONT_SIZE_MD,
    color: CO_GRAY_DARK,
    flex: 1,
  },
  attributionBox: {
    backgroundColor: CO_GRAY_LIGHT,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_LG,
    marginBottom: SPACING_MD,
  },
  attributionTitle: {
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_SEMIBOLD,
    color: CO_BLUE,
    marginBottom: 4,
  },
  attributionText: {
    fontSize: FONT_SIZE_SM,
    lineHeight: 20,
    color: CO_GRAY_DARK,
  },
  disclaimerBox: {
    backgroundColor: CO_GRAY_LIGHT,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_LG,
    borderLeftWidth: 4,
    borderLeftColor: CO_BLUE,
  },
  disclaimerText: {
    fontSize: FONT_SIZE_SM,
    lineHeight: 20,
    color: CO_GRAY_DARK,
  },
  footer: {
    marginTop: SPACING_LG,
    paddingTop: SPACING_LG,
    borderTopWidth: 1,
    borderTopColor: CO_GRAY_LIGHT,
  },
  footerText: {
    fontSize: FONT_SIZE_SM,
    color: CO_GRAY_DARK,
    textAlign: 'center',
    marginBottom: 4,
  },
});
