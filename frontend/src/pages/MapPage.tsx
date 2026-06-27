import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import polylineDecoder from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';
import { Activity } from '../types';

interface MapPageProps {
  activities: Activity[];
}


const TILE_LAYERS = {
  dark: {
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  light: {
    label: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    label: 'Sat',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  topo: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  },
} as const;

type TileKey = keyof typeof TILE_LAYERS;

interface SportConfig {
  label: string;
  icon: string;
  color: string;
  visible: boolean;
}

const DEFAULT_SPORT_CONFIGS: Record<string, SportConfig> = {
  Run: { label: 'Running', icon: '🏃', color: '#FC4C02', visible: true },
  Ride: { label: 'Bike', icon: '🚴', color: '#3B82F6', visible: true },
  Swim: { label: 'Swimming', icon: '🏊', color: '#06B6D4', visible: true },
  Walk: { label: 'Walk', icon: '🚶', color: '#10B981', visible: true },
  Hike: { label: 'Hike', icon: '🥾', color: '#84CC16', visible: true },
  AlpineSki: { label: 'Skiing', icon: '⛷', color: '#E0F2FE', visible: true },
  NordicSki: { label: 'Nordic walking', icon: '🎿', color: '#BAE6FD', visible: true },
  Kayaking: { label: 'Kayaking', icon: '🛶', color: '#0EA5E9', visible: true },
  Other: { label: 'Other', icon: '🏅', color: '#9CA3AF', visible: true },
};

function getSportConfig(type: string, configs: Record<string, SportConfig>): SportConfig {
  return configs[type] ?? configs['Other'];
}

function SportRow({
  sportType,
  config,
  count,
  onChange,
}: {
  sportType: string;
  config: SportConfig;
  count: number;
  onChange: (updated: Partial<SportConfig>) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
      <button
        onClick={() => onChange({ visible: !config.visible })}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${config.visible
          ? 'border-transparent'
          : 'border-white/20 bg-transparent'
          }`}
        style={config.visible ? { backgroundColor: config.color, borderColor: config.color } : {}}
        title={config.visible ? 'Ukryj' : 'Pokaż'}
      >
        {config.visible && <span className="text-white text-xs">✓</span>}
      </button>

      <span className="text-base w-5 text-center">{config.icon}</span>

      <span className="text-white text-xs flex-1 truncate">{config.label}</span>

      <span className="text-[#7a7a7a] font-mono text-xs w-6 text-right">{count}</span>

      <input
        type="color"
        value={config.color}
        onChange={(e) => onChange({ color: e.target.value })}
        className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent p-0.5"
        title="Change color"
      />
    </div>
  );
}


export default function MapPage({ activities }: MapPageProps) {
  const [tileKey, setTileKey] = useState<TileKey>('dark');
  const [sportConfigs, setSportConfigs] = useState<Record<string, SportConfig>>(DEFAULT_SPORT_CONFIGS);
  const [panelOpen, setPanelOpen] = useState(true);

  const presentTypes = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of activities) {
      const t = a.sport_type || 'Other';
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [activities]);

  const allConfigs = useMemo(() => {
    const merged = { ...sportConfigs };
    for (const t of Object.keys(presentTypes)) {
      if (!merged[t]) {
        merged[t] = { label: t, icon: '🏅', color: '#9CA3AF', visible: true };
      }
    }
    return merged;
  }, [sportConfigs, presentTypes]);

  const withPolylines = activities.filter((a) => a.polyline);
  const visibleCount = withPolylines.filter((a) => {
    const cfg = getSportConfig(a.sport_type || 'Other', allConfigs);
    return cfg.visible;
  }).length;

  const tile = TILE_LAYERS[tileKey];

  const updateSport = (type: string, update: Partial<SportConfig>) => {
    setSportConfigs((prev) => ({
      ...prev,
      [type]: { ...(prev[type] ?? allConfigs[type]), ...update },
    }));
  };

  return (
    <div className="flex-1 relative overflow-hidden">

      <MapContainer
        center={[52.0693, 19.4803]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={tile.url} attribution={tile.attribution} />

        {withPolylines.map((activity) => {
          const type = activity.sport_type || 'Other';
          const cfg = getSportConfig(type, allConfigs);
          if (!cfg.visible) return null;
          try {
            const positions = polylineDecoder.decode(activity.polyline!);
            return (
              <Polyline
                key={activity.id}
                positions={positions}
                color={cfg.color}
                weight={2.5}
                opacity={0.7}
              />
            );
          } catch {
            return null;
          }
        })}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[1000] bg-black/70 backdrop-blur
                      border border-white/10 rounded-full px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-pulse" />
        <span className="text-white font-mono text-xs">{visibleCount} routes visible</span>
      </div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end">

        <div className="flex gap-1 bg-black/70 backdrop-blur border border-white/10 rounded-full p-1">
          {(Object.keys(TILE_LAYERS) as TileKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTileKey(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${tileKey === key
                ? 'bg-white text-black'
                : 'text-[#9a9a9a] hover:text-white'
                }`}
            >
              {TILE_LAYERS[key].label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="bg-black/70 backdrop-blur border border-white/10 rounded-full
                     px-3 py-2 text-xs font-mono text-[#9a9a9a] hover:text-white
                     uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          Layers {panelOpen ? '▲' : '▼'}
        </button>
      </div>

      {panelOpen && Object.keys(presentTypes).length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] w-64
                        bg-black/85 backdrop-blur border border-white/10
                        rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-white text-xs font-mono uppercase tracking-widest">Activity types</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const updated = { ...sportConfigs };
                  Object.keys(presentTypes).forEach((t) => {
                    updated[t] = { ...(allConfigs[t]), visible: true };
                  });
                  setSportConfigs(updated);
                }}
                className="text-[#7a7a7a] hover:text-white text-xs font-mono transition-colors"
              >
                all
              </button>
              <span className="text-white/15">|</span>
              <button
                onClick={() => {
                  const updated = { ...sportConfigs };
                  Object.keys(presentTypes).forEach((t) => {
                    updated[t] = { ...(allConfigs[t]), visible: false };
                  });
                  setSportConfigs(updated);
                }}
                className="text-[#7a7a7a] hover:text-white text-xs font-mono transition-colors"
              >
                none
              </button>
            </div>
          </div>

          <div className="px-4 max-h-72 overflow-y-auto">
            {Object.keys(presentTypes).map((type) => (
              <SportRow
                key={type}
                sportType={type}
                config={allConfigs[type]}
                count={presentTypes[type]}
                onChange={(update) => updateSport(type, update)}
              />
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center
                        bg-black/80 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <p className="text-white font-semibold">No routes available</p>
          </div>
        </div>
      )}

      <style>{`
        .leaflet-container { background: #0a0a0a; }
        .leaflet-control-zoom {
          margin-top: 80px !important;
          border: none !important;
        }
        .leaflet-control-zoom a {
          background: rgba(10,10,10,0.85) !important;
          color: #9a9a9a !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,255,255,0.15) !important;
          color: white !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,10,0.7) !important;
          color: #6a6a6a !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #8a8a8a !important; }
      `}</style>
    </div>
  );
}