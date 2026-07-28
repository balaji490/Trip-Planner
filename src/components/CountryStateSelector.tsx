import React, { useState } from 'react';
import { COUNTRIES_DATA, CountryItem, StateSubRegion } from '../data/countryData';
import { MapPin, Globe, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface CountryStateSelectorProps {
  onSelectSubRegion: (subRegion: StateSubRegion) => void;
  selectedDestinationId: string;
  className?: string;
}

export const CountryStateSelector: React.FC<CountryStateSelectorProps> = ({
  onSelectSubRegion,
  selectedDestinationId,
  className
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('india');

  const selectedCountry = COUNTRIES_DATA.find(c => c.id === selectedCountryId) || COUNTRIES_DATA[0];

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4 select-none", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Explore by Country & State</h3>
            <p className="text-xs text-slate-400">Select a country to view its states & famous regions</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 hidden sm:inline-block">
          {selectedCountry.flag} {selectedCountry.name} Selected ({selectedCountry.states.length} Regions)
        </span>
      </div>

      {/* Row 1: Country Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {COUNTRIES_DATA.map((country) => {
          const isSelected = country.id === selectedCountryId;

          return (
            <button
              key={country.id}
              type="button"
              onClick={() => setSelectedCountryId(country.id)}
              className={cn(
                "px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all duration-300 flex items-center gap-2 border shadow-sm",
                isSelected
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 border-sky-400 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-300/30 scale-105"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
              )}
            >
              <span className="text-base">{country.flag}</span>
              <span>{country.name}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-sky-300 border border-slate-700/60">
                {country.states.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Row 2: Sub-parts / States of Selected Country */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 text-sky-400">
            <MapPin className="w-3.5 h-3.5" /> States / Regions in {selectedCountry.name}:
          </span>
          <span className="text-[11px] text-slate-500">Click a state to jump to its carousel card</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {selectedCountry.states.map((state) => {
            const isActive = state.destinationId === selectedDestinationId;

            return (
              <div
                key={state.id}
                onClick={() => onSelectSubRegion(state)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-2 relative overflow-hidden",
                  isActive
                    ? "bg-slate-900 border-sky-400 ring-2 ring-sky-500/30 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                    {state.name}
                  </h4>
                  {isActive && (
                    <span className="p-1 rounded-full bg-sky-500 text-white shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {state.tagline}
                </p>

                <div className="flex items-center justify-between text-[10px] text-sky-400 font-semibold pt-1 border-t border-slate-800/60">
                  <span>Explore State</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
