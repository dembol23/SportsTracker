import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import polylineDecoder from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';
import { Activity } from '../types';

interface MapPageProps {
  activities: Activity[];
}

// ─── Tile layers ────────────────────────────────────────────────────────────

const TILE_LAYERS = {
  dark: {
    label: 'Ciemna',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  light: {
    label: 'Jasna',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    label: 'Satelita',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  topo: {
    label: 'Teren',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  },
} as const;

type TileKey = keyof typeof TILE_LAYERS;

// ─── Sport type config ───────────────────────────────────────────────────────

interface SportConfig {
  label: string;
  icon: string;
  color: string;
  visible: boolean;
}

const DEFAULT_SPORT_CONFIGS: Record<string, SportConfig> = {
  Run:         { label: 'Bieganie',    icon: '🏃', color: '#FC4C02', visible: true },
  Ride:        { label: 'Rower',       icon: '🚴', color: '#3B82F6', visible: true },
  VirtualRide: { label: 'Rower (wirt.)', icon: '🚴', color: '#6366F1', visible: true },
  VirtualRun:  { label: 'Bieg (wirt.)', icon: '🏃', color: '#F97316', visible: true },
  Swim:        { label: 'Pływanie',    icon: '🏊', color: '#06B6D4', visible: true },
  Walk:        { label: 'Spacer',      icon: '🚶', color: '#10B981', visible: true },
  Hike:        { label: 'Wędrówka',    icon: '🥾', color: '#84CC16', visible: true },
  AlpineSki:   { label: 'Narty',       icon: '⛷',  color: '#E0F2FE', visible: true },
  NordicSki:   { label: 'Narciarstwo biegowe', icon: '🎿', color: '#BAE6FD', visible: true },
  Kayaking:    { label: 'Kajak',       icon: '🛶', color: '#0EA5E9', visible: true },
  Other:       { label: 'Inne',        icon: '🏅', color: '#9CA3AF', visible: true },
};

function getSportConfig(type: string, configs: Record<string, SportConfig>): SportConfig {
  return configs[type] ?? configs['Other'];
}

// ─── Colour picker row ───────────────────────────────────────────────────────

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
    <div className="flex items-center gap-3 py-2 border-b border-[#1F2232] last:border-0">
      <button
        onClick={() => onChange({ visible: !config.visible })}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          config.visible
            ? 'border-transparent'
            : 'border-[#4B5563] bg-transparent'
        }`}
        style={config.visible ? { backgroundColor: config.color, borderColor: config.color } : {}}
        title={config.visible ? 'Ukryj' : 'Pokaż'}
      >
        {config.visible && <span className="text-white text-xs">✓</span>}
      </button>

      <span className="text-base w-5 text-center">{config.icon}</span>

      <span className="text-white text-xs flex-1 truncate">{config.label}</span>

      <span className="text-[#4B5563] font-mono text-xs w-6 text-right">{count}</span>

      <input
        type="color"
        value={config.color}
        onChange={(e) => onChange({ color: e.target.value })}
        className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent p-0.5"
        title="Zmień kolor"
      />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MapPage({ activities }: MapPageProps) {
  const [tileKey, setTileKey] = useState<TileKey>('dark');
  const [sportConfigs, setSportConfigs] = useState<Record<string, SportConfig>>(DEFAULT_SPORT_CONFIGS);
  const [panelOpen, setPanelOpen] = useState(true);

  // Collect all sport types present in actual data
  const presentTypes = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of activities) {
      const t = a.sport_type || 'Other';
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [activities]);

  // Ensure any sport type from data has a config entry
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

      {/* ── Map ── */}
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

      {/* ── Top-left stats badge ── */}
      <div className="absolute top-4 left-4 z-[1000] bg-[#0F1117]/90 backdrop-blur
                      border border-[#2D3142] rounded-full px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-pulse" />
        <span className="text-white font-mono text-xs">{visibleCount} widocznych tras</span>
      </div>

      {/* ── Top-right controls ── */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end">

        {/* Map style switcher */}
        <div className="flex gap-1 bg-[#0F1117]/90 backdrop-blur border border-[#2D3142] rounded-full p-1">
          {(Object.keys(TILE_LAYERS) as TileKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTileKey(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                tileKey === key
                  ? 'bg-[#FC4C02] text-white'
                  : 'text-[#6B7280] hover:text-white'
              }`}
            >
              {TILE_LAYERS[key].label}
            </button>
          ))}
        </div>

        {/* Panel toggle */}
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="bg-[#0F1117]/90 backdrop-blur border border-[#2D3142] rounded-full
                     px-3 py-2 text-xs font-mono text-[#9CA3AF] hover:text-white
                     uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          🎨 Warstwy {panelOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* ── Side panel: sport type controls ── */}
      {panelOpen && Object.keys(presentTypes).length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] w-64
                        bg-[#0F1117]/95 backdrop-blur border border-[#2D3142]
                        rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1F2232] flex items-center justify-between">
            <span className="text-white text-xs font-mono uppercase tracking-widest">Typy aktywności</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const updated = { ...sportConfigs };
                  Object.keys(presentTypes).forEach((t) => {
                    updated[t] = { ...(allConfigs[t]), visible: true };
                  });
                  setSportConfigs(updated);
                }}
                className="text-[#4B5563] hover:text-white text-xs font-mono transition-colors"
              >
                wszystkie
              </button>
              <span className="text-[#2D3142]">|</span>
              <button
                onClick={() => {
                  const updated = { ...sportConfigs };
                  Object.keys(presentTypes).forEach((t) => {
                    updated[t] = { ...(allConfigs[t]), visible: false };
                  });
                  setSportConfigs(updated);
                }}
                className="text-[#4B5563] hover:text-white text-xs font-mono transition-colors"
              >
                żadne
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

      {/* ── Empty state ── */}
      {activities.length === 0 && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center
                        bg-[#0F1117]/80 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <p className="text-4xl mb-4">🗺</p>
            <p className="text-white font-semibold">Brak tras do wyświetlenia</p>
            <p className="text-[#4B5563] text-sm font-mono mt-1">
              Zsynchronizuj ze Stravą, żeby zobaczyć swoją heatmapę
            </p>
          </div>
        </div>
      )}

      <style>{`
        .leaflet-container { background: #0f1117; }
        .leaflet-control-zoom {
          margin-top: 80px !important;
          border: none !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15,17,23,0.9) !important;
          color: #9CA3AF !important;
          border: 1px solid #2D3142 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #2D3142 !important;
          color: white !important;
        }
        .leaflet-control-attribution {
          background: rgba(15,17,23,0.7) !important;
          color: #374151 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #4B5563 !important; }
      `}</style>
    </div>
  );
}