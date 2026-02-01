# Layer Toggle Bug Fix

## The Problem

When toggling roadConditions OFF:
1. Toggle fired correctly: `roadConditions enabled: false` ✓
2. Filter ran: `Filtered overlays: 0` ✓
3. **Then immediately**: `Filtered overlays: 100 roadConditions enabled: true` ✗
4. MapView received 100 overlays instead of 0 ✗

**Root Cause:** MapView was calling `useMapLayers()` directly, creating a **SECOND instance** of the hook with its own independent state!

### What Was Happening

```
HomeScreen
  └─ useMapLayers() ← Instance #1
       ├─ enabledLayers state
       ├─ toggleLayer function
       └─ filtered data
  └─ LayerDropdown
       └─ calls toggleLayer from Instance #1

MapView
  └─ useMapLayers() ← Instance #2 (SEPARATE STATE!)
       ├─ enabledLayers state (independent)
       └─ filtered data (always uses defaults)
```

When you toggled:
1. LayerDropdown called `toggleLayer` from Instance #1
2. Instance #1 state updated: `roadConditions: false`
3. Instance #1 filters returned 0 overlays
4. **But MapView was using Instance #2** which still had default state
5. Instance #2 returned 100 overlays (roadConditions still true)

## The Fix

### Changed Architecture

**Before (BROKEN):**
```typescript
// HomeScreen
const { enabledLayers, toggleLayer } = useMapLayers();

// MapView (WRONG - creates second instance!)
const { overlays, markers } = useMapLayers();
```

**After (FIXED):**
```typescript
// HomeScreen - single source of truth
const { overlays, markers, enabledLayers, toggleLayer } = useMapLayers();

// Pass data down as props
<MapView overlays={overlays} markers={markers} />
<LayerDropdown enabledLayers={enabledLayers} onToggle={toggleLayer} />

// MapView - receives data as props
interface MapViewProps {
  overlays: MapOverlayData[];
  markers: MapMarkerData[];
}
```

### Files Modified

#### 1. src/components/Map/MapView.types.ts
Added props for overlays and markers:
```typescript
export interface MapViewProps {
  // ... existing props
  overlays: MapOverlayData[];
  markers: MapMarkerData[];
}
```

#### 2. src/components/Map/MapView.tsx
- **Removed** `useMapLayers()` call (was creating second instance)
- **Changed** to receive `overlays` and `markers` as props
- Updated logging to reflect props instead of hook data

**Before:**
```typescript
const { markers, overlays } = useMapLayers(); // WRONG!
```

**After:**
```typescript
export const MapView: React.FC<MapViewProps> = ({
  overlays,  // From props
  markers,   // From props
  // ... other props
}) => {
```

#### 3. src/screens/HomeScreen.tsx
- **Added** `overlays` and `markers` to props passed to MapView

**Before:**
```typescript
<MapView
  style={styles.map}
  onMapReady={handleMapReady}
  onMapError={handleMapError}
/>
```

**After:**
```typescript
<MapView
  style={styles.map}
  onMapReady={handleMapReady}
  onMapError={handleMapError}
  overlays={overlays}
  markers={markers}
/>
```

#### 4. src/hooks/useMapLayers.ts
**Optimization:** Changed filter logic from `useCallback` to `useMemo`

**Before:**
```typescript
const getFilteredOverlays = useCallback(() => {
  // ...
}, [deps]);

return {
  overlays: getFilteredOverlays(), // Function call on every render
  // ...
};
```

**After:**
```typescript
const filteredOverlays = useMemo(() => {
  // ...
}, [deps]);

return {
  overlays: filteredOverlays, // Memoized value
  // ...
};
```

**Benefits:**
- More efficient (no function calls on every render)
- Clearer intent (filtering is a derived value, not a function)
- Better React patterns

**Added Logging:**
- Hook initialization detection: logs when hook is called
- Helps identify if hook is being re-initialized unexpectedly

## Verification

### Expected Console Logs

#### On App Load
```
[useMapLayers] Hook called/initialized
[useMapLayers] Starting data fetch...
[Parser] parseIncidentsToMarkers: input count = 50
[useMapLayers] Filtered overlays: 100 roadConditions enabled: true
[useMapLayers] Filtered markers: { total: 50, incidents: 50, ... }
[MapView] Received data as props: { markers: 50, overlays: 100 }
```

**Key Check:** `[useMapLayers] Hook called/initialized` should appear **ONLY ONCE**
- If it appears multiple times, something is re-mounting HomeScreen

#### On Toggle roadConditions OFF
```
[useMapLayers] Toggled layer: roadConditions enabled: false
[useMapLayers] All enabled layers: { roadConditions: false, ... }
[useMapLayers] Filtered overlays: 0 roadConditions enabled: false
[MapView] Received data as props: { markers: 50, overlays: 0 }
[MapView] Created overlaysGeoJSON: { featureCount: 0 }
```

**Key Checks:**
- ✅ `Filtered overlays: 0` appears
- ✅ `roadConditions enabled: false` is correct
- ✅ NO second log showing `Filtered overlays: 100` with `enabled: true`
- ✅ MapView receives 0 overlays
- ✅ Blue lines disappear from map

#### On Toggle roadConditions ON
```
[useMapLayers] Toggled layer: roadConditions enabled: true
[useMapLayers] Filtered overlays: 100 roadConditions enabled: true
[MapView] Received data as props: { markers: 50, overlays: 100 }
[MapView] Created overlaysGeoJSON: { featureCount: 100 }
```

**Key Checks:**
- ✅ `Filtered overlays: 100` appears
- ✅ `roadConditions enabled: true` is correct
- ✅ MapView receives 100 overlays
- ✅ Blue lines reappear on map

### Visual Verification

1. **Open app** → See blue lines (road conditions) and red circles (incidents)
2. **Toggle "Road Conditions" OFF** → Blue lines disappear instantly
3. **Toggle "Road Conditions" ON** → Blue lines reappear instantly
4. **Toggle "Traffic Incidents" OFF** → Red circles disappear instantly
5. **Toggle "Weather Stations" ON** → Blue circles appear instantly

**All toggles should be instant with no flicker or double-render.**

## Success Criteria

✅ Only ONE instance of useMapLayers exists (in HomeScreen)
✅ MapView receives data as props, not from a hook
✅ Toggling a layer updates the single source of truth
✅ Filtered data flows down to MapView
✅ Console logs show filtering working correctly
✅ No duplicate logs showing state being reset
✅ Visual changes are immediate and stable

## Common Issues (If Still Not Working)

### Issue: Hook re-initializes on every render
**Check:** Count how many times you see `[useMapLayers] Hook called/initialized`
- Should be: 1 time (on app mount)
- If more: HomeScreen or parent is re-rendering excessively

**Fix:** Wrap HomeScreen callbacks in `useCallback` to prevent re-renders

### Issue: MapView doesn't update when toggling
**Check:** Does MapView log show updated prop counts?
- Look for `[MapView] Received data as props: { markers: X, overlays: Y }`
- Values should change when you toggle

**If not:** HomeScreen isn't passing new values (check HomeScreen render)
**If yes but map doesn't update:** MapView useMemo dependencies might be wrong

### Issue: State resets after toggle
**Check:** Do you see duplicate filter logs?
```
[useMapLayers] Filtered overlays: 0
[useMapLayers] Filtered overlays: 100  ← Should NOT happen!
```

**If yes:**
- Check for multiple useEffect hooks that modify enabledLayers
- Check for AsyncStorage loads that overwrite state
- Add guards to prevent re-initialization

### Issue: Layers flicker when toggling
**Check:** How fast do the logs appear?
- Should be: Toggle → Filter → MapView (instant)
- If delayed: Network re-fetch might be happening

**Fix:** Ensure toggle doesn't trigger data re-fetch (it shouldn't)
