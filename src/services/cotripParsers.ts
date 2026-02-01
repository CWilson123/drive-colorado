/**
 * COtrip data parsers - transform raw API data into map-ready formats.
 * All parsers handle errors gracefully and never throw - they return empty arrays on failure.
 */

import { CO_BLUE, CO_GOLD } from '@/constants';
import type {
  RoadCondition,
  Incident,
  WeatherStation,
  SnowPlow,
  PlannedEvent,
  DmsSign,
  WorkZone,
  MapOverlayData,
  MapMarkerData,
} from '@/types';

/** Work zone overlay color (orange/amber) */
const WORK_ZONE_COLOR = '#F59E0B';

/**
 * Validates that coordinates are valid numbers
 */
const isValidCoordinate = (coord: [number, number] | undefined | null): boolean => {
  if (!coord || !Array.isArray(coord) || coord.length !== 2) {
    return false;
  }
  const [lon, lat] = coord;
  return (
    typeof lon === 'number' &&
    typeof lat === 'number' &&
    !isNaN(lon) &&
    !isNaN(lat) &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};

/**
 * Parses road condition features into map overlay data
 * @param features - Array of RoadCondition GeoJSON features
 * @returns Array of MapOverlayData ready for map rendering
 */
export const parseRoadConditionsToOverlays = (
  features: RoadCondition[]
): MapOverlayData[] => {
  console.log('[Parser] parseRoadConditionsToOverlays: input count =', features.length);
  try {
    const overlays: MapOverlayData[] = [];

    for (const feature of features) {
      try {
        // Validate required fields
        if (!feature?.properties?.id) {
          console.warn('Road condition missing id, skipping');
          continue;
        }

        if (!feature?.geometry?.coordinates || !Array.isArray(feature.geometry.coordinates)) {
          console.warn(`Road condition ${feature.properties.id} has invalid coordinates, skipping`);
          continue;
        }

        // Validate all coordinates in the LineString
        const validCoordinates = feature.geometry.coordinates.filter((coord) => {
          if (!isValidCoordinate(coord)) {
            console.warn(
              `Road condition ${feature.properties.id} has invalid coordinate, filtering out`
            );
            return false;
          }
          return true;
        });

        if (validCoordinates.length < 2) {
          console.warn(
            `Road condition ${feature.properties.id} has fewer than 2 valid coordinates, skipping`
          );
          continue;
        }

        overlays.push({
          id: feature.properties.id,
          coordinates: validCoordinates,
          layerType: 'roadCondition',
          routeName: feature.properties.routeName || 'Unknown Route',
          conditions: feature.properties.currentConditions || [],
          color: CO_BLUE, // Default color for now
        });
      } catch (error) {
        console.warn('Failed to parse road condition feature:', error);
        continue;
      }
    }

    console.log('[Parser] parseRoadConditionsToOverlays: output count =', overlays.length);
    return overlays;
  } catch (error) {
    console.error('[Parser] Failed to parse road conditions:', error);
    return [];
  }
};

/**
 * Parses incident features into map marker data
 * IMPORTANT: Splits MultiPoint geometries into separate markers
 * @param features - Array of Incident GeoJSON features
 * @returns Array of MapMarkerData ready for map rendering
 */
export const parseIncidentsToMarkers = (features: Incident[]): MapMarkerData[] => {
  console.log('[Parser] parseIncidentsToMarkers: input count =', features.length);
  try {
    const markers: MapMarkerData[] = [];

    for (const feature of features) {
      try {
        // Validate required fields
        if (!feature?.properties?.id) {
          console.warn('Incident missing id, skipping');
          continue;
        }

        if (!feature?.geometry?.coordinates || !Array.isArray(feature.geometry.coordinates)) {
          console.warn(`Incident ${feature.properties.id} has invalid coordinates, skipping`);
          continue;
        }

        // Split MultiPoint into separate markers
        feature.geometry.coordinates.forEach((coord, index) => {
          if (!isValidCoordinate(coord)) {
            console.warn(
              `Incident ${feature.properties.id} coordinate ${index} is invalid, skipping`
            );
            return;
          }

          const [longitude, latitude] = coord;

          markers.push({
            id: `${feature.properties.id}#${index}`,
            coordinate: { latitude, longitude },
            layerType: 'incidents',
            title: feature.properties.type || 'Incident',
            subtitle: [feature.properties.severity, feature.properties.routeName]
              .filter(Boolean)
              .join(' - '),
            rawData: feature,
          });
        });
      } catch (error) {
        console.warn('Failed to parse incident feature:', error);
        continue;
      }
    }

    console.log('[Parser] parseIncidentsToMarkers: output count =', markers.length);
    return markers;
  } catch (error) {
    console.error('[Parser] Failed to parse incidents:', error);
    return [];
  }
};

/**
 * Parses weather station features into map marker data
 * @param features - Array of WeatherStation GeoJSON features
 * @returns Array of MapMarkerData ready for map rendering
 */
export const parseWeatherStationsToMarkers = (
  features: WeatherStation[]
): MapMarkerData[] => {
  console.log('[Parser] parseWeatherStationsToMarkers: input count =', features.length);
  try {
    const markers: MapMarkerData[] = [];

    for (const feature of features) {
      try {
        // Validate required fields
        if (!feature?.properties?.id) {
          console.warn('Weather station missing id, skipping');
          continue;
        }

        if (!isValidCoordinate(feature?.geometry?.coordinates)) {
          console.warn(
            `Weather station ${feature.properties.id} has invalid coordinates, skipping`
          );
          continue;
        }

        const [longitude, latitude] = feature.geometry.coordinates;

        // Extract temperature from sensors if available
        let subtitle: string | undefined;
        const tempSensor = feature.properties.sensors?.find(
          (sensor) => sensor.type?.toLowerCase() === 'temperature'
        );
        if (tempSensor?.currentReading) {
          subtitle = tempSensor.currentReading;
        }

        markers.push({
          id: feature.properties.id,
          coordinate: { latitude, longitude },
          layerType: 'weatherStations',
          title: feature.properties.publicName || feature.properties.name || 'Weather Station',
          subtitle,
          rawData: feature,
        });
      } catch (error) {
        console.warn('Failed to parse weather station feature:', error);
        continue;
      }
    }

    console.log('[Parser] parseWeatherStationsToMarkers: output count =', markers.length);
    return markers;
  } catch (error) {
    console.error('[Parser] Failed to parse weather stations:', error);
    return [];
  }
};

/**
 * Parses snow plow records into map marker data
 * NOTE: Snow plows use a different structure (NOT GeoJSON)
 * @param records - Array of SnowPlow records
 * @returns Array of MapMarkerData ready for map rendering
 */
export const parseSnowPlowsToMarkers = (records: SnowPlow[]): MapMarkerData[] => {
  console.log('[Parser] parseSnowPlowsToMarkers: input count =', records.length);
  try {
    const markers: MapMarkerData[] = [];

    for (const record of records) {
      try {
        // Validate required fields - snow plow structure is different
        const vehicleId =
          record?.avl_location?.vehicle?.id ||
          record?.avl_location?.vehicle?.id2 ||
          String(record?.rtdh_timestamp || '');

        if (!vehicleId) {
          console.warn('Snow plow missing vehicle id, skipping');
          continue;
        }

        const latitude = record?.avl_location?.position?.latitude;
        const longitude = record?.avl_location?.position?.longitude;

        if (
          typeof latitude !== 'number' ||
          typeof longitude !== 'number' ||
          isNaN(latitude) ||
          isNaN(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          console.warn(`Snow plow ${vehicleId} has invalid coordinates, skipping`);
          continue;
        }

        // Build title - include vehicle type if not "Unknown"
        const vehicleType = record.avl_location.vehicle?.type;
        let title = 'Snow Plow';
        if (vehicleType && vehicleType !== 'Unknown') {
          title = `Snow Plow - ${vehicleType}`;
        }

        // Get status info, handle "Unknown" gracefully
        const statusInfo = record.avl_location.current_status?.info;
        const subtitle =
          statusInfo && statusInfo !== 'Unknown' ? statusInfo : undefined;

        markers.push({
          id: vehicleId,
          coordinate: { latitude, longitude },
          layerType: 'snowPlows',
          title,
          subtitle,
          rawData: record,
        });
      } catch (error) {
        console.warn('Failed to parse snow plow record:', error);
        continue;
      }
    }

    console.log('[Parser] parseSnowPlowsToMarkers: output count =', markers.length);
    return markers;
  } catch (error) {
    console.error('[Parser] Failed to parse snow plows:', error);
    return [];
  }
};

/**
 * Parses planned event features into map marker data
 * IMPORTANT: Uses first coordinate from MultiPoint geometry
 * @param features - Array of PlannedEvent GeoJSON features
 * @returns Array of MapMarkerData ready for map rendering
 */
export const parsePlannedEventsToMarkers = (features: PlannedEvent[]): MapMarkerData[] => {
  console.log('[Parser] parsePlannedEventsToMarkers: input count =', features.length);
  try {
    const markers: MapMarkerData[] = [];

    for (const feature of features) {
      try {
        // Validate required fields
        if (!feature?.properties?.id) {
          console.warn('Planned event missing id, skipping');
          continue;
        }

        if (!feature?.geometry?.coordinates || !Array.isArray(feature.geometry.coordinates)) {
          console.warn(`Planned event ${feature.properties.id} has invalid coordinates, skipping`);
          continue;
        }

        // Use first coordinate from MultiPoint
        const firstCoord = feature.geometry.coordinates[0];
        if (!isValidCoordinate(firstCoord)) {
          console.warn(`Planned event ${feature.properties.id} has invalid first coordinate, skipping`);
          continue;
        }

        const [longitude, latitude] = firstCoord;

        // Build subtitle from type and route
        const subtitle = [feature.properties.type, feature.properties.routeName]
          .filter(Boolean)
          .join(' - ');

        markers.push({
          id: feature.properties.id,
          coordinate: { latitude, longitude },
          layerType: 'plannedEvents',
          title: feature.properties.name || 'Planned Event',
          subtitle: subtitle || undefined,
          rawData: feature,
        });
      } catch (error) {
        console.warn('Failed to parse planned event feature:', error);
        continue;
      }
    }

    console.log('[Parser] parsePlannedEventsToMarkers: output count =', markers.length);
    return markers;
  } catch (error) {
    console.error('[Parser] Failed to parse planned events:', error);
    return [];
  }
};

/**
 * Parses DMS sign features into map marker data
 * @param features - Array of DmsSign GeoJSON features
 * @returns Array of MapMarkerData ready for map rendering
 */
export const parseDmsSignsToMarkers = (features: DmsSign[]): MapMarkerData[] => {
  console.log('[Parser] parseDmsSignsToMarkers: input count =', features.length);
  try {
    const markers: MapMarkerData[] = [];

    for (const feature of features) {
      try {
        // Validate required fields
        if (!feature?.properties?.id) {
          console.warn('DMS sign missing id, skipping');
          continue;
        }

        if (!isValidCoordinate(feature?.geometry?.coordinates)) {
          console.warn(`DMS sign ${feature.properties.id} has invalid coordinates, skipping`);
          continue;
        }

        const [longitude, latitude] = feature.geometry.coordinates;

        // Build subtitle from display status and route
        const displayStatus = feature.properties.displayStatus || 'unknown';
        const subtitle = [
          displayStatus === 'on' ? 'Active' : displayStatus === 'off' ? 'Off' : displayStatus,
          feature.properties.routeName,
        ]
          .filter(Boolean)
          .join(' - ');

        markers.push({
          id: feature.properties.id,
          coordinate: { latitude, longitude },
          layerType: 'dmsSigns',
          title: feature.properties.publicName || feature.properties.name || 'DMS Sign',
          subtitle: subtitle || undefined,
          rawData: feature,
        });
      } catch (error) {
        console.warn('Failed to parse DMS sign feature:', error);
        continue;
      }
    }

    console.log('[Parser] parseDmsSignsToMarkers: output count =', markers.length);
    return markers;
  } catch (error) {
    console.error('[Parser] Failed to parse DMS signs:', error);
    return [];
  }
};

/**
 * Parses work zone features into map overlay data
 * NOTE: Work zones use WZDx format with core_details in properties
 * @param features - Array of WorkZone features
 * @returns Array of MapOverlayData ready for map rendering
 */
export const parseWorkZonesToOverlays = (features: WorkZone[]): MapOverlayData[] => {
  console.log('[Parser] parseWorkZonesToOverlays: input count =', features.length);
  try {
    const overlays: MapOverlayData[] = [];

    for (const feature of features) {
      try {
        // Generate ID from data source or index
        const id = feature?.properties?.core_details?.data_source_id || `wz-${overlays.length}`;

        if (!feature?.geometry?.coordinates || !Array.isArray(feature.geometry.coordinates)) {
          console.warn(`Work zone ${id} has invalid coordinates, skipping`);
          continue;
        }

        // Handle both LineString and MultiPoint geometries
        let coordinates: Array<[number, number]> = [];

        if (feature.geometry.type === 'LineString') {
          // Already a line - validate coordinates
          coordinates = feature.geometry.coordinates.filter((coord) => {
            if (!isValidCoordinate(coord)) {
              console.warn(`Work zone ${id} has invalid coordinate, filtering out`);
              return false;
            }
            return true;
          });
        } else if (feature.geometry.type === 'MultiPoint') {
          // Convert MultiPoint to line by connecting points in order
          coordinates = feature.geometry.coordinates.filter((coord) => {
            if (!isValidCoordinate(coord)) {
              console.warn(`Work zone ${id} has invalid coordinate, filtering out`);
              return false;
            }
            return true;
          });
        }

        if (coordinates.length < 2) {
          console.warn(`Work zone ${id} has fewer than 2 valid coordinates, skipping`);
          continue;
        }

        const coreDetails = feature.properties.core_details;
        const routeName = coreDetails?.road_names?.join(', ') || 'Unknown Road';

        overlays.push({
          id,
          coordinates,
          layerType: 'workZone',
          routeName,
          color: WORK_ZONE_COLOR,
          description: coreDetails?.description,
          direction: coreDetails?.direction,
          eventType: coreDetails?.event_type,
          rawData: feature,
        });
      } catch (error) {
        console.warn('Failed to parse work zone feature:', error);
        continue;
      }
    }

    console.log('[Parser] parseWorkZonesToOverlays: output count =', overlays.length);
    return overlays;
  } catch (error) {
    console.error('[Parser] Failed to parse work zones:', error);
    return [];
  }
};
