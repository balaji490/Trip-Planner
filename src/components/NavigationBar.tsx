import React from 'react';
import { Compass, Sparkles, Layers, Search, Camera } from 'lucide-react';
import { MapSearch } from './MapSearch';
import { Destination } from '../types/trip';
import { cn } from '../lib/utils';

export type NavTab = 'discover' | 'studio' | 'flash-plan' | 'itinerary-map';

interface NavigationBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeDestination: Destination;
  onSelectSearchResult: (dest: Destination) => void;
  onAddToTrip: (dest: Destination) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  activeDestination,
  onSelectSearchResult,
  onAddToTrip,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-500/30 bg-[#090D16]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - WAY FINDER */}
        <div
          onClick={() => onTabChange('discover')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              WAY <span className="text-cyan-400">FINDER</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
              AI Route Engine • Studio Gallery • Leaflet Route Map
            </p>
          </div>
        </div>

        {/* Global Autocomplete Search Input */}
        <div className="hidden md:block flex-1 max-w-md mx-2">
          <MapSearch
            onSelectSearchResult={(dest) => {
              onSelectSearchResult(dest);
              onTabChange('itinerary-map');
            }}
            onAddToTrip={(dest) => {
              onAddToTrip(dest);
              onTabChange('itinerary-map');
            }}
          />
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1 p-1.5 bg-[#0F1629] rounded-2xl border border-violet-500/30 shadow-inner">
          <button
            type="button"
            onClick={() => onTabChange('discover')}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'discover'
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Discover</span>
          </button>

          {/* New Tab: Way Finder Studio */}
          <button
            type="button"
            onClick={() => onTabChange('studio')}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'studio'
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('flash-plan')}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 relative",
              activeTab === 'flash-plan'
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Flash Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('itinerary-map')}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'itinerary-map'
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Itinerary & Map</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input Row */}
      <div className="md:hidden px-4 pb-3">
        <MapSearch
          onSelectSearchResult={(dest) => {
            onSelectSearchResult(dest);
            onTabChange('itinerary-map');
          }}
          onAddToTrip={(dest) => {
            onAddToTrip(dest);
            onTabChange('itinerary-map');
          }}
        />
      </div>
    </header>
  );
};
