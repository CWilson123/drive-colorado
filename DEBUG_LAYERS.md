# Layer Display Debugging Guide

## Console Log Flow

When you open the app and toggle layers, you should see this sequence of logs:

### 1. Initial Data Fetch
```
[useMapLayers] Starting data fetch...
[Parser] parseRoadConditionsToOverlays: input count = X
[Parser] parseRoadConditionsToOverlays: output count = X
[Parser] parseIncidentsToMarkers: input count = X
[Parser] parseIncidentsToMarkers: output count = X
[Parser] parseWeatherStationsToMarkers: input count = X
[Parser] parseWeatherStationsToMarkers: output count = X
[Parser] parseSnowPlowsToMarkers: input count = X
[Parser] parseSnowPlowsToMarkers: output count = X
[useMapLayers] Fetched raw data: { roadConditions: X, incidents: X, ... }
[useMapLayers] Parsed data: { roadConditions: X, incidents: X, ... }
```

### 2. Initial Filter (based on default enabled layers)
```
[useMapLayers] Filtered overlays: X roadConditions enabled: true
[useMapLayers] Filtered markers: { total: X, incidents: X, ... }
```

### 3. MapView Receives Data
```
[MapView] Received data from hook: { markers: X, overlays: X }
[MapView] Created markersGeoJSON: { featureCount: X, sampleFeature: {...} }
[MapView] Created overlaysGeoJSON: { featureCount: X, sampleFeature: {...} }
```

### 4. Layer Toggle
When you toggle a layer in the dropdown:
```
[useMapLayers] Toggled layer: incidents enabled: false
[useMapLayers] All enabled layers: { roadConditions: true, incidents: false, ... }
[useMapLayers] Filtered markers: { total: X, incidents: 0, ... }
[MapView] Received data from hook: { markers: X, overlays: X }
[MapView] Created markersGeoJSON: { featureCount: X, ... }
```

## Layer ID Reference

These IDs MUST match everywhere:

| Layer | ID | Type | Default Enabled |
|-------|-----|------|----------------|
| Road Conditions | `roadConditions` | Overlay (LineString) | true |
| Incidents | `incidents` | Marker (Point) | true |
| Weather Stations | `weatherStations` | Marker (Point) | false |
| Snow Plows | `snowPlows` | Marker (Point) | false |

## Common Issues to Check

### Issue 1: No data showing at all
**Check:** Are parsers receiving data?
- Look for `[Parser] input count = 0`
- If 0, API fetch is failing
- Check network tab or API errors

**Check:** Are parsers outputting data?
- Look for `[Parser] output count = 0`
- If input > 0 but output = 0, parser is rejecting all data
- Check for coordinate validation errors in console

### Issue 2: Layers don't toggle
**Check:** Is toggleLayer being called?
- Look for `[useMapLayers] Toggled layer: X enabled: Y`
- If not appearing, LayerDropdown isn't calling the prop

**Check:** Are filtered counts changing?
- Look for `[useMapLayers] Filtered markers` changing when you toggle
- If counts don't change, filter logic is broken

### Issue 3: GeoJSON empty
**Check:** Does MapView receive data from hook?
- Look for `[MapView] Received data from hook: { markers: 0, overlays: 0 }`
- If 0, filtering is removing everything

**Check:** Is GeoJSON being created?
- Look for `[MapView] Created markersGeoJSON: { featureCount: 0 }`
- If marker count is > 0 but featureCount is 0, GeoJSON conversion is failing

### Issue 4: Coordinates invalid
**Check:** Sample feature coordinates
- Look at `sampleFeature` in the GeoJSON logs
- Coordinates should be `[longitude, latitude]` with numbers like `[-105.xxx, 39.xxx]`
- If `[null, null]` or `[NaN, NaN]`, coordinate extraction is broken

## Expected Behavior

When app loads:
1. ✅ Road Conditions overlay (blue lines) should appear
2. ✅ Incidents markers (red circles) should appear
3. ❌ Weather Stations should NOT appear (disabled by default)
4. ❌ Snow Plows should NOT appear (disabled by default)

When you toggle Road Conditions OFF:
1. Blue lines should disappear
2. Log should show: `roadConditions enabled: false`
3. Log should show: `Filtered overlays: 0`

When you toggle Weather Stations ON:
1. Blue circles should appear
2. Log should show: `weatherStations enabled: true`
3. Log should show filtered markers count increase

## Quick Fix Checklist

- [ ] All layer IDs use exact strings: `roadConditions`, `incidents`, `weatherStations`, `snowPlows`
- [ ] GeoJSON coordinates are `[longitude, latitude]` not `[latitude, longitude]`
- [ ] Parsers don't return empty arrays due to validation
- [ ] FilteredMarkers/Overlays functions check correct enabledLayers keys
- [ ] MapView useMemo dependencies include markers and overlays arrays
- [ ] ShapeSource has stable id prop
- [ ] No console errors about invalid GeoJSON
