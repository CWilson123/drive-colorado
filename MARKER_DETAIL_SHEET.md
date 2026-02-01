# MarkerDetailSheet Component

## Overview

The MarkerDetailSheet is a bottom sheet component that slides up to display detailed information when a user taps on map markers or road condition overlays. It provides different content layouts based on the type of data being displayed.

## Features

- **Smooth animations**: Spring animation (damping: 20, stiffness: 150)
- **Gesture support**: Swipe down to close (drag handle at top)
- **Multiple layouts**: Different UI for incidents, weather stations, snow plows, and road conditions
- **Backdrop dimming**: Semi-transparent backdrop that closes on tap
- **Scrollable content**: Handles long content gracefully
- **Type-safe**: Full TypeScript support

## Component Structure

```
src/components/MarkerDetailSheet/
├── MarkerDetailSheet.tsx       # Main component
├── MarkerDetailSheet.types.ts  # TypeScript definitions
└── index.ts                    # Barrel export
```

## Props

```typescript
interface MarkerDetailSheetProps {
  visible: boolean;              // Controls sheet visibility
  marker: MapMarkerData | null;  // Point marker data (incidents, weather, plows)
  overlay: MapOverlayData | null; // Road condition overlay data
  onClose: () => void;           // Called when sheet should close
}
```

## Content Layouts

### 1. Incidents (layerType === 'incidents')

**Header:**
- 🚨 Red icon circle
- Incident title and subtitle
- Red tinted background

**Content:**
- Severity badge (MINOR/MODERATE/MAJOR)
  - Minor: Blue
  - Moderate: Yellow/Gold
  - Major: Red
- Description block with blue left border
- 2x2 data grid:
  - Direction
  - Status
  - Category
  - Route
- Footer: Last updated timestamp

**Data Source:** `Incident` type from rawData

### 2. Weather Stations (layerType === 'weatherStations')

**Header:**
- 🌡️ Blue icon circle
- Station name and route
- Blue tinted background

**Content:**
- Large sensor cards (2-column):
  - Temperature (22px bold)
  - Wind Speed (22px bold)
- Sensor rows:
  - 💧 Humidity
  - 🌧️ Precipitation
  - Each row: colored icon bg, label, value
- Footer: Last updated timestamp

**Data Source:** `WeatherStation` type from rawData

### 3. Snow Plows (layerType === 'snowPlows')

**Header:**
- 🚜 Gold icon circle
- "CDOT Plow Unit" title
- Vehicle subtitle
- Gold tinted background

**Content:**
- "ACTIVE" status badge (green)
- Direction card:
  - Arrow in orange circle (shows bearing)
  - Heading (degrees)
  - Speed (mph)
- 2-column data grid:
  - Vehicle Type
  - Activity
- Full-width GPS update card
- Footer: Position update time

**Data Source:** `SnowPlow` type from rawData

### 4. Road Conditions (overlay !== null)

**Header:**
- 🛣️ Gold icon circle
- Road name
- "Road Condition" subtitle
- Gold tinted background

**Content:**
- Condition badge (dynamically colored):
  - Closed: Red
  - Snow/Icy: Blue
  - Wet: Gold
  - Dry: Green
- Colored condition strip bar (8px height)
- Description block with travel advisory
- Footer: Last updated timestamp

**Data Source:** `MapOverlayData` from overlay prop

## Data Flow

### User Interaction Flow
```
1. User taps marker on map
   ↓
2. MapView onPress handler fires
   ↓
3. MapView finds marker data by ID
   ↓
4. MapView calls onMarkerPress(markerData)
   ↓
5. HomeScreen sets selectedMarker state
   ↓
6. MarkerDetailSheet receives marker
   ↓
7. Sheet slides up with appropriate content
```

### Closing Flow
```
User can close by:
- Tapping X button (top right)
- Tapping backdrop (dimmed area)
- Swiping down (future enhancement with PanGestureHandler)

Any close action:
   ↓
Calls onClose()
   ↓
HomeScreen sets selectedMarker/selectedOverlay to null
   ↓
Sheet slides down and unmounts
```

## Integration Points

### In MapView.tsx

**Added props:**
```typescript
onMarkerPress?: (marker: MapMarkerData) => void;
onOverlayPress?: (overlay: MapOverlayData) => void;
```

**Handlers:**
```typescript
const handleMarkerPress = (event: any): void => {
  const feature = event?.features?.[0];
  if (feature) {
    const markerId = feature.id || feature.properties?.id;
    const markerData = markers.find((m) => m.id === markerId);
    if (markerData && onMarkerPress) {
      onMarkerPress(markerData);
    }
  }
};
```

**Wiring:**
```tsx
<ShapeSource id="cotrip-markers" shape={markersGeoJSON} onPress={handleMarkerPress}>
  <CircleLayer ... />
</ShapeSource>

<ShapeSource id="road-conditions" shape={overlaysGeoJSON} onPress={handleOverlayPress}>
  <LineLayer ... />
</ShapeSource>
```

### In HomeScreen.tsx

**State:**
```typescript
const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
const [selectedOverlay, setSelectedOverlay] = useState<MapOverlayData | null>(null);
```

**Handlers:**
```typescript
const handleMarkerPress = useCallback((marker: MapMarkerData): void => {
  setSelectedMarker(marker);
  setSelectedOverlay(null);
}, []);

const handleOverlayPress = useCallback((overlay: MapOverlayData): void => {
  setSelectedOverlay(overlay);
  setSelectedMarker(null);
}, []);

const handleDetailSheetClose = useCallback((): void => {
  setSelectedMarker(null);
  setSelectedOverlay(null);
}, []);
```

**Rendering:**
```tsx
<MapView
  onMarkerPress={handleMarkerPress}
  onOverlayPress={handleOverlayPress}
  // ... other props
/>

<MarkerDetailSheet
  visible={!!(selectedMarker || selectedOverlay)}
  marker={selectedMarker}
  overlay={selectedOverlay}
  onClose={handleDetailSheetClose}
/>
```

## Styling Constants

All styling uses constants from `src/constants/colors.ts`:

**Colors:**
- `CO_RED` - Incidents (header, badges)
- `CO_BLUE` - Weather stations (header, minor severity)
- `CO_GOLD` - Snow plows, road conditions (header, moderate severity)
- `CO_WHITE` - Sheet background, text on badges
- `CO_GRAY_LIGHT` - Data card backgrounds
- `CO_GRAY_DARK` - Labels, secondary text
- `CO_BLACK` - Primary text, values
- `COLOR_SUCCESS` - Active status badge (green)

**Typography:**
- Labels: 10px, bold, uppercase, CO_GRAY_DARK
- Values: 14px (FONT_SIZE_MD), bold, CO_BLACK
- Large values: 22px (FONT_SIZE_XL), bold (temperature, wind)
- Title: 18px (FONT_SIZE_LG), bold
- Subtitle: 12px (FONT_SIZE_SM), CO_GRAY_DARK

**Spacing:**
- Sheet border radius: 16px (BORDER_RADIUS_LG) - top corners only
- Card border radius: 10px (BORDER_RADIUS_MD)
- Padding: Uses SPACING_SM, SPACING_MD, SPACING_LG

**Layout:**
- Sheet height: 70% of screen height
- Drag handle: 36px wide, 4px tall
- Icon circles: 48px diameter (header), 32px (sensors), 60px (direction)
- Data grid: 50% width per column (2-column layout)

## Animation Details

**Spring animation configuration:**
```typescript
Animated.spring(translateY, {
  toValue: visible ? 0 : SHEET_HEIGHT,
  damping: 20,        // Controls bounce
  stiffness: 150,     // Controls speed
  useNativeDriver: true,
});
```

**Backdrop fade:**
```typescript
opacity: translateY.interpolate({
  inputRange: [0, SHEET_HEIGHT],
  outputRange: [1, 0],
})
```

## Helper Functions

**getSeverityFromSubtitle(subtitle?: string): SeverityLevel**
- Extracts severity level from incident subtitle
- Returns 'minor', 'moderate', or 'major'
- Used to determine badge color

**getSeverityColor(severity: SeverityLevel): string**
- Maps severity to color
- major → CO_RED
- moderate → CO_GOLD
- minor → CO_BLUE

**getConditionColor(condition: string): string**
- Maps road condition to color
- Closed → CO_RED
- Snow/Icy → CO_BLUE
- Wet → CO_GOLD
- Dry → COLOR_SUCCESS

## Testing Checklist

### Incidents
- [ ] Tap incident marker shows red-themed sheet
- [ ] Severity badge shows correct color
- [ ] All data fields populate
- [ ] Timestamp formats correctly

### Weather Stations
- [ ] Tap weather station shows blue-themed sheet
- [ ] Temperature and wind show in large cards
- [ ] Sensor rows display with icons
- [ ] Missing sensors handled gracefully

### Snow Plows
- [ ] Tap snow plow shows gold-themed sheet
- [ ] Active badge shows in green
- [ ] Direction arrow and values display
- [ ] GPS timestamp formats correctly

### Road Conditions
- [ ] Tap road overlay shows gold-themed sheet
- [ ] Condition badge color matches condition type
- [ ] Condition strip shows with correct color
- [ ] Description text displays

### Interactions
- [ ] Sheet slides up smoothly
- [ ] Tap backdrop closes sheet
- [ ] Tap X button closes sheet
- [ ] Sheet slides down smoothly on close
- [ ] Can switch between markers without closing
- [ ] Scrolling works for long content

## Future Enhancements

1. **Swipe down gesture**: Add PanGestureHandler for native swipe-to-close
2. **Action buttons**: Implement "Navigate", "All Sensors", "Full Route" actions
3. **Image support**: Add camera images for traffic cameras
4. **Share functionality**: Share marker details
5. **Favorite markers**: Save frequently viewed locations
6. **Accessibility**: Add screen reader labels and focus management
7. **Dark mode**: Support dark theme
8. **Animations**: Add micro-interactions (button presses, badge pulse)

## Known Limitations

1. **Fixed height**: Sheet is 70% of screen height (could be dynamic based on content)
2. **No swipe gesture**: Currently requires button/backdrop tap to close
3. **No keyboard avoidance**: If future fields added, needs KeyboardAvoidingView
4. **No image caching**: Future camera images would benefit from caching
5. **Limited sensor display**: Only shows 4 sensor types, more could be added
