import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Plus } from 'lucide-react';
import { Destination } from '../types/trip';
import { cn } from '../lib/utils';

interface MapSearchProps {
  onSelectSearchResult: (destination: Destination) => void;
  onAddToTrip: (destination: Destination) => void;
  className?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    country?: string;
  };
}

export const MapSearch: React.FC<MapSearchProps> = ({
  onSelectSearchResult,
  onAddToTrip,
  className
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced Nominatim Geocoding Search with Relevance Filtering
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1`
        );
        const data: NominatimResult[] = await response.json();

        const queryLower = query.toLowerCase().trim();
        const queryTokens = queryLower.split(/\s+/);

        // Relevance Filter: Ensure display_name or address contains search tokens
        const filteredData = data.filter(item => {
          const displayNameLower = item.display_name.toLowerCase();
          return queryTokens.some(token => displayNameLower.includes(token));
        });

        const formatted: Destination[] = filteredData.map((item, idx) => {
          const parts = item.display_name.split(',');
          const name = parts[0].trim();
          const country = parts[parts.length - 1].trim();

          return {
            id: `geo-${item.place_id || idx}`,
            name: name,
            country: country,
            tagline: `Way Finder result in ${country}`,
            imageUrl: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop`,
            description: item.display_name,
            rating: 4.9,
            reviewCount: 650,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            quickFactsUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
            category: 'Search Alternative',
          };
        });

        setResults(formatted);
        setIsOpen(true);
      } catch (err) {
        console.error('Geocoding search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn("relative w-full max-w-xl", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-cyan-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Way Finder: Search any city, state, or landmark..."
          className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-[#090D16]/90 text-white placeholder-slate-400 border border-violet-500/30 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-md shadow-xl transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 w-4 h-4 text-cyan-400 animate-spin" />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0F1629]/95 border border-violet-500/40 rounded-2xl shadow-2xl backdrop-blur-xl max-h-80 overflow-y-auto divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                onSelectSearchResult(dest);
                setIsOpen(false);
              }}
              className="p-3.5 hover:bg-violet-600/20 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white group-hover:text-cyan-300">
                    {dest.name}
                  </h5>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {dest.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToTrip(dest);
                  setIsOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600 text-cyan-300 hover:text-white text-xs font-semibold border border-violet-500/40 transition-all flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Plan Here
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
