import { registerRootComponent } from 'expo';
import { Logger } from '@maplibre/maplibre-react-native';
import App from './App';

Logger.setLogLevel('warning'); // <-- important: tiles/glyph failures often show as warnings

Logger.setLogCallback((log) => {
  const msg = String(log?.message ?? '');
  const tag = String(log?.tag ?? '');

  // Only suppress the noisy cancel spam
  if (tag === 'Mbgl-HttpRequest' && msg.includes('Canceled')) return true;

  return false;
});

registerRootComponent(App);
