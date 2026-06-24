import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import polylineDecoder from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';
import { Activity } from '../types';

interface MapPageProps {
  activities: Activity[];
}

export default function MapPage({ activities }: MapPageProps) {
  const withPolylines = activities.filter((a) => a.polyline);

  return (
    <div className="flex-1 relative">
      {/* Activity count overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-[#0F1117]/90 backdrop-blur border border-[#2D3142]
                      rounded-lg px-4 py-2.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-pulse" />
        <span className="text-white font-mono text-xs">
          {withPolylines.length} / {activities.length} tras z trasą GPS
        </span>
      </div>

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

      <MapContainer
        center={[52.0693, 19.4803]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />

        {withPolylines.map((activity) => {
          try {
            const positions = polylineDecoder.decode(activity.polyline!);
            return (
              <Polyline
                key={activity.id}
                positions={positions}
                color="#FC4C02"
                weight={2.5}
                opacity={0.6}
              />
            );
          } catch {
            return null;
          }
        })}
      </MapContainer>

      {/* Leaflet link override to match dark theme */}
      <style>{`
        .leaflet-container {
          background: #1a1d27;
        }
        .leaflet-control-zoom a {
          background: #1A1D27 !important;
          color: #9CA3AF !important;
          border-color: #2D3142 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #2D3142 !important;
          color: white !important;
        }
        .leaflet-control-attribution {
          background: rgba(15,17,23,0.8) !important;
          color: #4B5563 !important;
        }
        .leaflet-control-attribution a {
          color: #6B7280 !important;
        }
      `}</style>
    </div>
  );
}
