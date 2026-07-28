import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Destination, TripStop } from '../types/trip';
import { Navigation, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper component to auto-fit map bounds so all 10 days of stops are visible
const MapAutoFitBounds: React.FC<{ stops: TripStop[]; mainDest: Destination }> = ({ stops, mainDest }) => {
  const map = useMap();

  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      bounds.extend([mainDest.lat, mainDest.lng]);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14, animate: true, duration: 1.2 });
    } else {
      map.flyTo([mainDest.lat, mainDest.lng], 12, { duration: 1.2 });
    }
  }, [stops, mainDest.lat, mainDest.lng, map]);

  return null;
};

// Map click listener to add a new stop at lat/lng
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface TripMapProps {
  destination: Destination;
  stops: TripStop[];
  selectedStopId: string | null;
  activeDayFilter: number | 'all';
  onSelectStop: (stop: TripStop) => void;
  onAddStopAtLocation: (lat: number, lng: number) => void;
  className?: string;
}

// Function to generate custom SVG HTML divIcon for Leaflet markers
const createCustomMarkerIcon = (numberLabel: string | number, isSelected: boolean, colorClass: string = 'bg-violet-600') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="w-8 h-8 rounded-full ${colorClass} text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow-xl ${
          isSelected ? 'ring-4 ring-cyan-400/80 scale-125 z-50' : 'hover:scale-110 z-10'
        } transition-all duration-300">
          ${numberLabel}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 ${colorClass} rotate-45 border-r border-b border-white"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const TripMap: React.FC<TripMapProps> = ({
  destination,
  stops,
  selectedStopId,
  activeDayFilter,
  onSelectStop,
  onAddStopAtLocation,
  className
}) => {
  const mapCenter: [number, number] = useMemo(() => {
    if (selectedStopId) {
      const found = stops.find(s => s.id === selectedStopId);
      if (found) return [found.lat, found.lng];
    }
    return [destination.lat, destination.lng];
  }, [destination.lat, destination.lng, selectedStopId, stops]);

  // Filter stops by active day
  const filteredStops = useMemo(() => {
    if (activeDayFilter === 'all') return stops;
    return stops.filter(s => s.dayNumber === activeDayFilter);
  }, [stops, activeDayFilter]);

  // Build Polyline route coordinates array for all stops
  const routePositions: [number, number][] = useMemo(() => {
    return filteredStops.map(stop => [stop.lat, stop.lng]);
  }, [filteredStops]);

  return (
    <div className={cn("relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl bg-[#090D16]", className)}>
      {/* Top Floating Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="px-4 py-2 rounded-2xl bg-[#090D16]/95 border border-violet-500/30 backdrop-blur-md shadow-xl text-xs font-semibold text-white pointer-events-auto flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{destination.name} Route Map</span>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-bold border border-violet-500/30">
            {filteredStops.length} stops mapped
          </span>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-[#090D16]/90 border border-slate-800 backdrop-blur-md text-[11px] text-slate-300 pointer-events-auto">
          💡 Click anywhere on map to add a custom stop
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Auto fit bounds to cover all 10-day waypoints */}
        <MapAutoFitBounds stops={filteredStops} mainDest={destination} />
        <MapClickHandler onMapClick={onAddStopAtLocation} />

        {/* Dynamic Continuous Route Polyline path connecting all waypoints */}
        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#8B5CF6',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round',
            }}
          />
        )}

        {/* Main Destination Country / City Hub Anchor Marker */}
        <Marker
          position={[destination.lat, destination.lng]}
          icon={createCustomMarkerIcon('📍', false, 'bg-gradient-to-r from-violet-600 to-cyan-500')}
        >
          <Popup>
            <div className="p-1 space-y-1 text-slate-100">
              <h4 className="font-bold text-sm text-cyan-400">{destination.name} Hub</h4>
              <p className="text-xs text-slate-300">Central Destination Point</p>
            </div>
          </Popup>
        </Marker>

        {/* Sequential Itinerary Waypoint Markers across Days 1 to 10 */}
        {filteredStops.map((stop, idx) => {
          const isSelected = stop.id === selectedStopId;
          const stopNumber = idx + 1;

          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={createCustomMarkerIcon(stopNumber, isSelected, isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-gradient-to-tr from-violet-600 to-indigo-600')}
              eventHandlers={{
                click: () => onSelectStop(stop),
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 min-w-[210px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600 text-white">
                      Stop #{stopNumber} • Day {stop.dayNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">{stop.time}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white leading-tight">{stop.title}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-cyan-400" /> {stop.locationName}
                    </p>
                  </div>

                  {stop.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{stop.description}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectStop(stop)}
                    className="w-full mt-1 py-1.5 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors text-center"
                  >
                    Select Activity Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
