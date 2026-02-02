/**
 * MarkerDetailSheet component - Bottom sheet displaying detailed marker information.
 *
 * Slides up from bottom when a marker is tapped on the map.
 * Shows different content layouts based on marker type.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CO_BLUE,
  CO_RED,
  CO_GOLD,
  CO_WHITE,
  CO_GRAY,
  CO_GRAY_LIGHT,
  CO_GRAY_DARK,
  CO_BLACK,
  COLOR_SUCCESS,
  BORDER_RADIUS_LG,
  BORDER_RADIUS_MD,
  SPACING_SM,
  SPACING_MD,
  SPACING_LG,
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_SIZE_LG,
  FONT_SIZE_XL,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  Z_INDEX_MODAL,
  LayerIcon,
  LAYER_ICON_SIZE_LG,
} from '@/constants';
import type {
  MarkerDetailSheetProps,
  SeverityLevel,
  RoadConditionType,
} from './MarkerDetailSheet.types';
import type { Incident, WeatherStation, SnowPlow, PlannedEvent, DmsSign, WorkZone } from '@/types';

/** Work zone color (orange/amber) */
const WORK_ZONE_COLOR = '#F59E0B';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% of screen height
const DRAG_HANDLE_WIDTH = 36;
const DRAG_HANDLE_WIDTH_DRAGGING = 42;
const DRAG_HANDLE_HEIGHT = 4;
const DISMISS_THRESHOLD = 120; // pixels
const VELOCITY_THRESHOLD = 800; // pixels per second
const DRAG_HANDLE_NORMAL_COLOR = '#D1D5DB';
const DRAG_HANDLE_ACTIVE_COLOR = '#9CA3AF';

/**
 * Extracts severity level from subtitle string
 */
const getSeverityFromSubtitle = (subtitle?: string): SeverityLevel => {
  if (!subtitle) return 'minor';
  const lower = subtitle.toLowerCase();
  if (lower.includes('major')) return 'major';
  if (lower.includes('moderate')) return 'moderate';
  return 'minor';
};

/**
 * Gets color for severity badge
 */
const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'major':
      return CO_RED;
    case 'moderate':
      return CO_GOLD;
    case 'minor':
      return CO_BLUE;
    default:
      return CO_GRAY;
  }
};

/**
 * Gets color for road condition
 */
const getConditionColor = (condition: string): string => {
  const lower = condition.toLowerCase();
  if (lower.includes('closed')) return CO_RED;
  if (lower.includes('snow') || lower.includes('icy')) return CO_BLUE;
  if (lower.includes('wet')) return CO_GOLD;
  if (lower.includes('dry')) return COLOR_SUCCESS;
  return CO_GRAY;
};

/**
 * Main marker detail sheet component
 */
export const MarkerDetailSheet: React.FC<MarkerDetailSheetProps> = ({
  visible,
  marker,
  overlay,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const dragTranslateY = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const scrollOffset = useRef(0);
  const lastGestureY = useRef(0);

  // Log props changes
  useEffect(() => {
    console.log('[MarkerDetailSheet] Props changed:', {
      visible,
      hasMarker: !!marker,
      markerId: marker?.id,
      markerLayerType: marker?.layerType,
      hasOverlay: !!overlay,
      overlayId: overlay?.id,
    });
  }, [visible, marker, overlay]);

  // Open/close animation
  useEffect(() => {
    console.log('[MarkerDetailSheet] Animation effect triggered:', {
      visible,
      hasMarker: !!marker,
      hasOverlay: !!overlay,
    });
    if (visible && (marker || overlay)) {
      console.log('[MarkerDetailSheet] Opening sheet animation...');
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
      // Reset drag translation when opening
      dragTranslateY.setValue(0);
    } else {
      console.log('[MarkerDetailSheet] Closing sheet animation...');
      Animated.spring(translateY, {
        toValue: SHEET_HEIGHT,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, marker, overlay, translateY, dragTranslateY]);

  /**
   * Handle pan gesture for drag-to-dismiss
   */
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragTranslateY } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationY } = event.nativeEvent;
        lastGestureY.current = translationY;

        // Only allow downward drags (clamp to >= 0)
        if (translationY < 0) {
          dragTranslateY.setValue(0);
        }
      },
    }
  );

  /**
   * Handle gesture state changes (start, end)
   */
  const onHandlerStateChange = (event: any) => {
    const { state, translationY, velocityY } = event.nativeEvent;

    if (state === State.BEGAN) {
      setIsDragging(true);
    }

    if (state === State.END || state === State.CANCELLED) {
      setIsDragging(false);

      const shouldDismiss =
        translationY > DISMISS_THRESHOLD || velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        // Animate the sheet off-screen from its current dragged position
        // Then call onClose to update state (useEffect will see it's already closed)
        Animated.spring(dragTranslateY, {
          toValue: SHEET_HEIGHT,
          damping: 20,
          stiffness: 150,
          useNativeDriver: true,
        }).start(() => {
          // Transfer the off-screen position to translateY before resetting dragTranslateY
          // This prevents a flicker when dragTranslateY resets to 0
          translateY.setValue(SHEET_HEIGHT);
          dragTranslateY.setValue(0);
          onClose();
        });
      } else {
        // Snap back to open position
        Animated.spring(dragTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          mass: 0.8,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  /**
   * Handle X button and backdrop dismiss
   */
  const handleClose = () => {
    // Reset drag offset and call onClose immediately
    // Let the useEffect handle the closing animation via translateY
    dragTranslateY.setValue(0);
    onClose();
  };

  /**
   * Track scroll position to prevent drag-sheet conflict
   */
  const handleScroll = (event: any) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  if (!visible && translateY.__getValue() === SHEET_HEIGHT) {
    return null;
  }

  // Backdrop opacity fades as sheet is dragged down
  const backdropOpacity = Animated.add(translateY, dragTranslateY).interpolate({
    inputRange: [0, SHEET_HEIGHT],
    outputRange: [0.5, 0],
    extrapolate: 'clamp',
  });

  // Combine open/close animation with drag gesture
  const combinedTranslateY = Animated.add(translateY, dragTranslateY);

  // Drag handle styling
  const dragHandleWidth = isDragging ? DRAG_HANDLE_WIDTH_DRAGGING : DRAG_HANDLE_WIDTH;
  const dragHandleColor = isDragging ? DRAG_HANDLE_ACTIVE_COLOR : DRAG_HANDLE_NORMAL_COLOR;

  const renderContent = () => {
    if (overlay) {
      if (overlay.layerType === 'workZone') {
        return renderWorkZoneContent(overlay);
      }
      return renderRoadConditionContent(overlay);
    }
    if (!marker) return null;

    switch (marker.layerType) {
      case 'incidents':
        return renderIncidentContent(marker);
      case 'weatherStations':
        return renderWeatherStationContent(marker);
      case 'snowPlows':
        return renderSnowPlowContent(marker);
      case 'plannedEvents':
        return renderPlannedEventContent(marker);
      case 'dmsSigns':
        return renderDmsSignContent(marker);
      default:
        return null;
    }
  };

  const renderIncidentContent = (marker: any) => {
    const incident = marker.rawData as Incident;
    const severity = getSeverityFromSubtitle(marker.subtitle);
    const severityColor = getSeverityColor(severity);

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_RED + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: CO_RED }]}>
            <LayerIcon layerKey="incidents" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{marker.title}</Text>
            {marker.subtitle && (
              <Text style={styles.subtitle}>{marker.subtitle}</Text>
            )}
          </View>
        </View>

        {/* Severity Badge */}
        <View style={[styles.badge, { backgroundColor: severityColor }]}>
          <Text style={styles.badgeText}>{severity.toUpperCase()}</Text>
        </View>

        {/* Description */}
        {incident.properties.type && (
          <View style={[styles.descriptionBlock, { borderLeftColor: CO_BLUE }]}>
            <Text style={styles.descriptionText}>{incident.properties.type}</Text>
          </View>
        )}

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>DIRECTION</Text>
            <Text style={styles.dataValue}>{incident.properties.direction || 'N/A'}</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>STATUS</Text>
            <Text style={styles.dataValue}>{incident.properties.status || 'Active'}</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>CATEGORY</Text>
            <Text style={styles.dataValue}>{incident.properties.category || 'N/A'}</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>ROUTE</Text>
            <Text style={styles.dataValue}>{incident.properties.routeName || 'N/A'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            Updated: {new Date(incident.properties.lastUpdated).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderWeatherStationContent = (marker: any) => {
    const station = marker.rawData as WeatherStation;
    const tempSensor = station.properties.sensors?.find(
      (s) => s.type?.toLowerCase() === 'temperature'
    );
    const windSensor = station.properties.sensors?.find(
      (s) => s.type?.toLowerCase() === 'wind speed'
    );
    const humiditySensor = station.properties.sensors?.find(
      (s) => s.type?.toLowerCase() === 'humidity'
    );
    const precipSensor = station.properties.sensors?.find(
      (s) => s.type?.toLowerCase() === 'precipitation'
    );

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_BLUE + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: CO_BLUE }]}>
            <LayerIcon layerKey="weatherStations" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{marker.title}</Text>
            <Text style={styles.subtitle}>{station.properties.routeName}</Text>
          </View>
        </View>

        {/* Large Sensor Cards */}
        <View style={styles.largeDataGrid}>
          {tempSensor && (
            <View style={styles.largeDataCard}>
              <Text style={styles.dataLabel}>TEMPERATURE</Text>
              <Text style={styles.largeDataValue}>{tempSensor.currentReading}</Text>
            </View>
          )}
          {windSensor && (
            <View style={styles.largeDataCard}>
              <Text style={styles.dataLabel}>WIND SPEED</Text>
              <Text style={styles.largeDataValue}>{windSensor.currentReading}</Text>
            </View>
          )}
        </View>

        {/* Sensor Rows */}
        <View style={styles.sensorList}>
          {humiditySensor && (
            <View style={styles.sensorRow}>
              <View style={[styles.sensorIcon, { backgroundColor: CO_BLUE + '20' }]}>
                <Text style={styles.sensorEmoji}>💧</Text>
              </View>
              <Text style={styles.sensorLabel}>Humidity</Text>
              <Text style={styles.sensorValue}>{humiditySensor.currentReading}</Text>
            </View>
          )}
          {precipSensor && (
            <View style={styles.sensorRow}>
              <View style={[styles.sensorIcon, { backgroundColor: CO_BLUE + '20' }]}>
                <Text style={styles.sensorEmoji}>🌧️</Text>
              </View>
              <Text style={styles.sensorLabel}>Precipitation</Text>
              <Text style={styles.sensorValue}>{precipSensor.currentReading}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            Updated: {new Date(station.properties.lastUpdated).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderSnowPlowContent = (marker: any) => {
    const plow = marker.rawData as SnowPlow;

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_GOLD + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: CO_GOLD }]}>
            <LayerIcon layerKey="snowPlows" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>CDOT Plow Unit</Text>
            <Text style={styles.subtitle}>{marker.title}</Text>
          </View>
        </View>

        {/* Active Badge */}
        <View style={[styles.badge, { backgroundColor: COLOR_SUCCESS }]}>
          <Text style={styles.badgeText}>ACTIVE</Text>
        </View>

        {/* Direction Card */}
        {plow.avl_location.position && (
          <View style={styles.directionCard}>
            <View style={[styles.directionCircle, { backgroundColor: CO_GOLD + '20' }]}>
              <Text style={styles.directionText}>↑</Text>
            </View>
            <View style={styles.directionInfo}>
              <Text style={styles.dataLabel}>HEADING</Text>
              <Text style={styles.dataValue}>
                {Math.round(plow.avl_location.position.bearing)}°
              </Text>
              <Text style={styles.dataLabel}>SPEED</Text>
              <Text style={styles.dataValue}>
                {Math.round(plow.avl_location.position.speed)} mph
              </Text>
            </View>
          </View>
        )}

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>VEHICLE TYPE</Text>
            <Text style={styles.dataValue}>
              {plow.avl_location.vehicle.type || 'Plow'}
            </Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>ACTIVITY</Text>
            <Text style={styles.dataValue}>
              {plow.avl_location.current_status.info || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* GPS Update */}
        <View style={[styles.fullWidthCard, { backgroundColor: CO_GRAY_LIGHT }]}>
          <Text style={styles.dataLabel}>LAST GPS UPDATE</Text>
          <Text style={styles.dataValue}>
            {new Date(plow.rtdh_timestamp * 1000).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderRoadConditionContent = (overlay: any) => {
    const condition = overlay.conditions?.[0]?.condition || 'Unknown';
    const conditionColor = getConditionColor(condition);

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_GOLD + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: CO_GOLD }]}>
            <LayerIcon layerKey="roadConditions" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{overlay.routeName}</Text>
            <Text style={styles.subtitle}>Road Condition</Text>
          </View>
        </View>

        {/* Condition Badge */}
        <View style={[styles.badge, { backgroundColor: conditionColor }]}>
          <Text style={styles.badgeText}>{condition.toUpperCase()}</Text>
        </View>

        {/* Condition Strip */}
        <View style={[styles.conditionStrip, { backgroundColor: conditionColor }]} />

        {/* Description */}
        <View style={[styles.descriptionBlock, { borderLeftColor: conditionColor }]}>
          <Text style={styles.descriptionText}>
            Current road conditions may affect travel times and safety.
          </Text>
        </View>

        {/* Footer */}
        {overlay.conditions?.[0]?.timeStamp && (
          <View style={styles.footer}>
            <Text style={styles.timestamp}>
              Updated: {new Date(overlay.conditions[0].timeStamp).toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderPlannedEventContent = (marker: any) => {
    const event = marker.rawData as PlannedEvent;

    // Format schedule times
    const formatSchedule = () => {
      if (!event.properties.schedule || event.properties.schedule.length === 0) {
        return null;
      }
      return event.properties.schedule.map((entry, index) => {
        const start = new Date(entry.startTime).toLocaleString();
        const end = new Date(entry.endTime).toLocaleString();
        return (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.dataLabel}>SCHEDULE {index + 1}</Text>
            <Text style={styles.dataValue}>{start}</Text>
            <Text style={styles.dataValue}>to {end}</Text>
          </View>
        );
      });
    };

    // Format lane impacts
    const formatLaneImpacts = () => {
      if (!event.properties.laneImpacts || event.properties.laneImpacts.length === 0) {
        return null;
      }
      return event.properties.laneImpacts.map((impact, index) => (
        <View key={index} style={styles.sensorRow}>
          <Text style={styles.sensorLabel}>
            {impact.direction}: {impact.laneCount} lane(s)
          </Text>
          <Text style={styles.sensorValue}>
            {impact.closedLaneTypes?.join(', ') || 'N/A'}
          </Text>
        </View>
      ));
    };

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_BLUE + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: CO_BLUE }]}>
            <LayerIcon layerKey="plannedEvents" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{event.properties.name || 'Planned Event'}</Text>
            <Text style={styles.subtitle}>{event.properties.routeName}</Text>
          </View>
        </View>

        {/* Type Badge */}
        <View style={[styles.badge, { backgroundColor: CO_BLUE }]}>
          <Text style={styles.badgeText}>{(event.properties.type || 'EVENT').toUpperCase()}</Text>
        </View>

        {/* Project Description */}
        {event.properties.project?.description && (
          <View style={[styles.descriptionBlock, { borderLeftColor: CO_BLUE }]}>
            <Text style={styles.descriptionText}>{event.properties.project.description}</Text>
          </View>
        )}

        {/* Traveler Information */}
        {event.properties.travelerInformationMessage && (
          <View style={[styles.fullWidthCard, { backgroundColor: CO_GRAY_LIGHT }]}>
            <Text style={styles.dataLabel}>TRAVELER INFO</Text>
            <Text style={styles.descriptionText}>{event.properties.travelerInformationMessage}</Text>
          </View>
        )}

        {/* Schedule */}
        {formatSchedule()}

        {/* Lane Impacts */}
        {event.properties.laneImpacts && event.properties.laneImpacts.length > 0 && (
          <View style={styles.sensorList}>
            <Text style={[styles.dataLabel, { marginBottom: SPACING_SM }]}>LANE IMPACTS</Text>
            {formatLaneImpacts()}
          </View>
        )}

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>STATUS</Text>
            <Text style={styles.dataValue}>{event.properties.project?.status || 'Active'}</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>OVERSIZE LOADS</Text>
            <Text style={styles.dataValue}>
              {event.properties.isOversizedLoadsProhibited ? 'Prohibited' : 'Allowed'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        {event.properties.startTime && (
          <View style={styles.footer}>
            <Text style={styles.timestamp}>
              Start: {new Date(event.properties.startTime).toLocaleString()}
            </Text>
            {event.properties.clearTime && (
              <Text style={styles.timestamp}>
                Clear: {new Date(event.properties.clearTime).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderDmsSignContent = (marker: any) => {
    const sign = marker.rawData as DmsSign;
    const isOn = sign.properties.displayStatus === 'on';
    const statusColor = isOn ? COLOR_SUCCESS : CO_GRAY;

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: CO_GOLD + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: isOn ? CO_GOLD : CO_GRAY }]}>
            <LayerIcon layerKey="dmsSigns" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{sign.properties.publicName || sign.properties.name || 'DMS Sign'}</Text>
            <Text style={styles.subtitle}>{sign.properties.routeName} {sign.properties.direction}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{isOn ? 'ACTIVE' : 'OFF'}</Text>
        </View>

        {/* Current Message (if on and has message) */}
        {isOn && sign.properties.currentMessage && sign.properties.currentMessage.length > 0 && (
          <View style={[styles.fullWidthCard, { backgroundColor: CO_GOLD + '15' }]}>
            <Text style={styles.dataLabel}>CURRENT MESSAGE</Text>
            {sign.properties.currentMessage.map((line, index) => (
              <Text key={index} style={[styles.dataValue, { textAlign: 'center' }]}>{line}</Text>
            ))}
          </View>
        )}

        {/* Off message */}
        {!isOn && (
          <View style={[styles.descriptionBlock, { borderLeftColor: CO_GRAY }]}>
            <Text style={styles.descriptionText}>
              This sign is currently not displaying a message.
            </Text>
          </View>
        )}

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>MILE MARKER</Text>
            <Text style={styles.dataValue}>{sign.properties.marker || 'N/A'}</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>COMM STATUS</Text>
            <Text style={styles.dataValue}>{sign.properties.communicationStatus || 'Unknown'}</Text>
          </View>
        </View>

        {/* Footer */}
        {sign.properties.lastUpdated && (
          <View style={styles.footer}>
            <Text style={styles.timestamp}>
              Updated: {new Date(sign.properties.lastUpdated).toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderWorkZoneContent = (overlay: any) => {
    const workZone = overlay.rawData as WorkZone;
    const coreDetails = workZone?.properties?.core_details;

    return (
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={scrollOffset.current > 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: WORK_ZONE_COLOR + '15' }]}>
          <View style={[styles.iconCircle, { backgroundColor: WORK_ZONE_COLOR }]}>
            <LayerIcon layerKey="workZones" size={LAYER_ICON_SIZE_LG} color={CO_WHITE} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{coreDetails?.name || overlay.routeName || 'Work Zone'}</Text>
            <Text style={styles.subtitle}>Work Zone</Text>
          </View>
        </View>

        {/* Event Type Badge */}
        {coreDetails?.event_type && (
          <View style={[styles.badge, { backgroundColor: WORK_ZONE_COLOR }]}>
            <Text style={styles.badgeText}>{coreDetails.event_type.toUpperCase()}</Text>
          </View>
        )}

        {/* Condition Strip */}
        <View style={[styles.conditionStrip, { backgroundColor: WORK_ZONE_COLOR }]} />

        {/* Description */}
        {(coreDetails?.description || overlay.description) && (
          <View style={[styles.descriptionBlock, { borderLeftColor: WORK_ZONE_COLOR }]}>
            <Text style={styles.descriptionText}>
              {coreDetails?.description || overlay.description}
            </Text>
          </View>
        )}

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>ROAD</Text>
            <Text style={styles.dataValue}>
              {coreDetails?.road_names?.join(', ') || overlay.routeName || 'N/A'}
            </Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>DIRECTION</Text>
            <Text style={styles.dataValue}>{coreDetails?.direction || overlay.direction || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet with drag gesture */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10} // Only activate after 10px vertical movement
        failOffsetX={[-20, 20]} // Fail if horizontal swipe
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              bottom: insets.bottom,
              transform: [{ translateY: combinedTranslateY }],
            },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <Animated.View
              style={[
                styles.dragHandle,
                {
                  width: dragHandleWidth,
                  backgroundColor: dragHandleColor,
                },
              ]}
            />
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Content */}
          {renderContent()}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: Z_INDEX_MODAL + 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: CO_WHITE,
    borderTopLeftRadius: BORDER_RADIUS_LG,
    borderTopRightRadius: BORDER_RADIUS_LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING_SM,
  },
  dragHandle: {
    height: DRAG_HANDLE_HEIGHT,
    borderRadius: DRAG_HANDLE_HEIGHT / 2,
    // width and backgroundColor are animated
  },
  closeButton: {
    position: 'absolute',
    top: SPACING_MD,
    right: SPACING_MD,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CO_GRAY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: CO_GRAY_DARK,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: SPACING_MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_MD,
    marginBottom: SPACING_MD,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING_MD,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE_LG,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLACK,
  },
  subtitle: {
    fontSize: FONT_SIZE_SM,
    color: CO_GRAY_DARK,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING_MD,
    paddingVertical: SPACING_SM,
    borderRadius: BORDER_RADIUS_MD,
    marginBottom: SPACING_MD,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_WHITE,
    letterSpacing: 1,
  },
  descriptionBlock: {
    borderLeftWidth: 4,
    paddingLeft: SPACING_MD,
    paddingVertical: SPACING_SM,
    marginBottom: SPACING_MD,
  },
  descriptionText: {
    fontSize: FONT_SIZE_MD,
    color: CO_GRAY_DARK,
    lineHeight: 20,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING_SM / 2,
    marginBottom: SPACING_MD,
  },
  dataCard: {
    width: '50%',
    padding: SPACING_SM / 2,
  },
  largeDataGrid: {
    flexDirection: 'row',
    marginHorizontal: -SPACING_SM / 2,
    marginBottom: SPACING_MD,
  },
  largeDataCard: {
    flex: 1,
    backgroundColor: CO_GRAY_LIGHT,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_MD,
    marginHorizontal: SPACING_SM / 2,
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_GRAY_DARK,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLACK,
  },
  largeDataValue: {
    fontSize: FONT_SIZE_XL,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLACK,
  },
  sensorList: {
    marginBottom: SPACING_MD,
  },
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING_SM,
    borderBottomWidth: 1,
    borderBottomColor: CO_GRAY_LIGHT,
  },
  sensorIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS_MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING_SM,
  },
  sensorEmoji: {
    fontSize: 16,
  },
  sensorLabel: {
    flex: 1,
    fontSize: FONT_SIZE_MD,
    color: CO_GRAY_DARK,
  },
  sensorValue: {
    fontSize: FONT_SIZE_MD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_BLACK,
  },
  directionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CO_GRAY_LIGHT,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_MD,
    marginBottom: SPACING_MD,
  },
  directionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING_MD,
  },
  directionText: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT_BOLD,
    color: CO_GOLD,
  },
  directionInfo: {
    flex: 1,
  },
  fullWidthCard: {
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_MD,
    marginBottom: SPACING_MD,
  },
  conditionStrip: {
    height: 8,
    borderRadius: 4,
    marginBottom: SPACING_MD,
  },
  footer: {
    paddingVertical: SPACING_MD,
    borderTopWidth: 1,
    borderTopColor: CO_GRAY_LIGHT,
    marginTop: SPACING_MD,
  },
  timestamp: {
    fontSize: FONT_SIZE_SM,
    color: CO_GRAY_DARK,
    textAlign: 'center',
  },
  scheduleItem: {
    backgroundColor: CO_GRAY_LIGHT,
    padding: SPACING_MD,
    borderRadius: BORDER_RADIUS_MD,
    marginBottom: SPACING_SM,
  },
});
