# Layer Display Fix Summary

## Critical Bug Fixed: Layer ID Mismatch

### The Problem
The layer IDs were inconsistent between different parts of the codebase:

**Before (BROKEN):**
- `enabledLayers` keys: `'incidents'`, `'weatherStations'`, `'snowPlows'` (plural)
- `MapMarkerData.layerType`: `'incident'`, `'weatherStation'`, `'snowPlow'` (singular)
- Parser output: Singular forms
- MapView CircleLayer: Singular forms

This caused the filtering logic to fail because:
```typescript
if (enabledLayers.incidents) {  // Checking 'incidents'
  markers.push(...cachedData.incidents);  // But markers had layerType: 'incident'
}
```

The layer type didn't match, so toggling didn't work!

### The Fix
**After (FIXED):**
All layer IDs now use **plural forms** consistently:
- ✅ `enabledLayers` keys: `'roadConditions'`, `'incidents'`, `'weatherStations'`, `'snowPlows'`
- ✅ `MapMarkerData.layerType`: `'incidents'`, `'weatherStations'`, `'snowPlows'`
- ✅ Parser output: Plural forms
- ✅ MapView CircleLayer: Plural forms
- ✅ LayerDropdown IDs: Plural forms

## Files Modified

### 1. src/types/cotrip.ts
- Changed `MapMarkerData.layerType` from singular to plural forms

### 2. src/services/cotripParsers.ts
- `parseIncidentsToMarkers`: Changed `layerType: 'incident'` → `'incidents'`
- `parseWeatherStationsToMarkers`: Changed `layerType: 'weatherStation'` → `'weatherStations'`
- `parseSnowPlowsToMarkers`: Changed `layerType: 'snowPlow'` → `'snowPlows'`
- Added console logs to all parsers

### 3. src/hooks/useMapLayers.ts
- Added console logs for:
  - Data fetching (raw counts)
  - Parsing results
  - Layer toggling
  - Filtering operations

### 4. src/components/Map/MapView.tsx
- Updated CircleLayer color matching to use plural forms
- Added console logs for:
  - Received data from hook
  - GeoJSON creation

### 5. DEBUG_LAYERS.md (NEW)
- Comprehensive debugging guide
- Expected console log flow
- Common issues checklist
- Quick fix reference

## Testing Instructions

### 1. Check Initial Load
Open the app and look for these logs in order:
```
[useMapLayers] Starting data fetch...
[Parser] parseRoadConditionsToOverlays: input count = X
[Parser] parseIncidentsToMarkers: input count = X
[useMapLayers] Fetched raw data: { roadConditions: X, incidents: X, ... }
[useMapLayers] Filtered overlays: X
[useMapLayers] Filtered markers: { total: X, incidents: X, ... }
[MapView] Received data from hook: { markers: X, overlays: X }
[MapView] Created markersGeoJSON: { featureCount: X }
[MapView] Created overlaysGeoJSON: { featureCount: X }
```

**Expected on map:**
- ✅ Blue lines (road conditions) - VISIBLE
- ✅ Red circles (incidents) - VISIBLE
- ❌ Blue circles (weather stations) - HIDDEN (disabled by default)
- ❌ Orange circles (snow plows) - HIDDEN (disabled by default)

### 2. Test Layer Toggle - Road Conditions OFF
1. Tap layers button (top right)
2. Toggle "Road Conditions" switch OFF
3. Watch console logs:
```
[useMapLayers] Toggled layer: roadConditions enabled: false
[useMapLayers] Filtered overlays: 0 roadConditions enabled: false
[MapView] Received data from hook: { markers: X, overlays: 0 }
[MapView] Created overlaysGeoJSON: { featureCount: 0 }
```
4. **Expected:** Blue lines disappear immediately

### 3. Test Layer Toggle - Weather Stations ON
1. Toggle "Weather Stations" switch ON
2. Watch console logs:
```
[useMapLayers] Toggled layer: weatherStations enabled: true
[useMapLayers] Filtered markers: { ..., weatherStations: X, ... }
[MapView] Created markersGeoJSON: { featureCount: increased }
```
3. **Expected:** Blue circles appear immediately

### 4. Test Layer Toggle - Incidents OFF
1. Toggle "Traffic Incidents" switch OFF
2. Watch console logs show filtered markers decrease
3. **Expected:** Red circles disappear immediately

## Troubleshooting

### Still not seeing markers?

**Check 1: Are parsers receiving data?**
- Look for `[Parser] input count = 0`
- If 0, check network connectivity or API key

**Check 2: Are parsers outputting data?**
- Look for `[Parser] output count = 0`
- If input > 0 but output = 0, parsers are rejecting data
- Check for coordinate validation warnings

**Check 3: Is filtering working?**
- Look at `[useMapLayers] Filtered markers` log
- Compare `enabledLayers` object with marker counts
- Should see counts change when toggling

**Check 4: Is MapView receiving data?**
- Look for `[MapView] Received data from hook`
- If markers/overlays are 0 when they shouldn't be, filtering is broken

**Check 5: Is GeoJSON valid?**
- Look at `sampleFeature` in the logs
- Coordinates should be `[longitude, latitude]` with valid numbers
- Example: `[-105.0123, 39.7456]` ✅
- NOT: `[null, null]` ❌ or `[39.7456, -105.0123]` ❌ (wrong order)

### MapLibre not rendering?

**Check MapLibre errors:**
- Open React Native debugger
- Look for MapLibre/MapBox GL errors
- Common issue: Invalid GeoJSON structure

**Check ShapeSource:**
- Verify ShapeSource has stable `id` prop
- Verify shape prop is valid GeoJSON
- Check that features array is not undefined

## Success Criteria

✅ Console shows complete data flow from fetch → parse → filter → GeoJSON
✅ Road Conditions (blue lines) visible on initial load
✅ Incidents (red circles) visible on initial load
✅ Toggling a layer shows immediate visual change
✅ Console logs show filtering counts changing
✅ No console errors about invalid coordinates or GeoJSON
✅ Layer dropdown shows correct enabled/disabled state

## Layer ID Reference (Final)

| UI Name | Layer ID | Type | Default | Color |
|---------|----------|------|---------|-------|
| Road Conditions | `roadConditions` | LineString | ON | Blue |
| Traffic Incidents | `incidents` | Point | ON | Red |
| Weather Stations | `weatherStations` | Point | OFF | Blue |
| Snow Plows | `snowPlows` | Point | OFF | Gold |

All these IDs are now **100% consistent** across:
- useMapLayers.ts (enabledLayers keys)
- LayerDropdown.tsx (AVAILABLE_LAYERS IDs)
- cotripParsers.ts (layerType values)
- MapView.tsx (CircleLayer color matching)
- cotrip.ts (TypeScript type definitions)
