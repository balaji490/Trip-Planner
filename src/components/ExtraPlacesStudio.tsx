import React, { useState } from 'react';
import { EXTRA_PLACES_DATA, StudioDestination } from '../data/extraPlacesData';
import { Destination } from '../types/trip';
import { Sparkles, MapPin, Star, Calendar, ArrowRight, Compass, Heart, Car, Zap, Trophy, Camera, Mountain, Waves } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExtraPlacesStudioProps {
  onPlanDestination: (dest: Destination) => void;
  className?: string;
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Featured', Icon: Sparkles },
  { id: 'beach', label: 'Famous Beaches', Icon: Waves },
  { id: 'mountain', label: 'Mountains & Trekking', Icon: Mountain },
  { id: 'honeymoon', label: 'Honeymoon Spots', Icon: Heart },
  { id: 'weekend', label: 'Weekend Getaways', Icon: Car },
  { id: 'adventure', label: 'Adventure & Sports', Icon: Zap },
  { id: 'top20', label: 'Top 20 Places', Icon: Trophy },
];

export const ExtraPlacesStudio: React.FC<ExtraPlacesStudioProps> = ({
  onPlanDestination,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'india' | 'international'>('all');

  const filteredPlaces = EXTRA_PLACES_DATA.filter((place) => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesScope = scopeFilter === 'all' || place.scope === scopeFilter;
    return matchesCategory && matchesScope;
  });

  const handleStudioCardClick = (place: StudioDestination) => {
    const dest: Destination = {
      id: place.id,
      name: place.name,
      country: place.country,
      tagline: place.tagline,
      imageUrl: place.imageUrl,
      description: place.description,
      rating: place.rating,
      reviewCount: 3200,
      lat: place.lat,
      lng: place.lng,
      quickFactsUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(place.name)}`,
      category: place.category.toUpperCase(),
      bestSeason: place.bestSeason,
    };

    onPlanDestination(dest);
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none", className)}>
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-violet-950/80 via-[#0F1629] to-cyan-950/80 border border-violet-500/40 shadow-2xl overflow-hidden text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-cyan-300 text-xs font-bold backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Way Finder Visual Studios & Extra Places</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Curated Extra Places & Visual Studio Gallery
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore world-famous beaches, mountain treks, honeymoon escapes, weekend getaways, and extreme adventure sports in India and abroad. Click any studio card to generate a full Way Finder route plan!
        </p>
      </div>

      {/* Category Pills & Scope Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F1629]/80 border border-slate-800">
        {/* Category Pills — No Emojis, Clean Lucide Icons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORY_FILTERS.map((cat) => {
            const IconComp = cat.Icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5",
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-cyan-400 shadow-lg shadow-violet-500/25 ring-2 ring-cyan-400/30"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                )}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Region Scope Filter Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#090D16] rounded-xl border border-slate-800 shrink-0">
          {([
            { key: 'all' as const, label: 'All Regions' },
            { key: 'india' as const, label: 'In India' },
            { key: 'international' as const, label: 'International' },
          ]).map((scope) => (
            <button
              key={scope.key}
              type="button"
              onClick={() => setScopeFilter(scope.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                scopeFilter === scope.key
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400">
          Showing <span className="text-cyan-400 font-bold">{filteredPlaces.length}</span> destinations
        </p>
      </div>

      {/* Visual Studio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            onClick={() => handleStudioCardClick(place)}
            className="group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-violet-500/50 bg-[#0F1629] shadow-2xl transition-all duration-500 hover:shadow-violet-500/20 cursor-pointer flex flex-col justify-between h-[420px]"
          >
            {/* Background Image with Zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/50 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#090D16]/80 text-cyan-300 border border-violet-500/40 backdrop-blur-md">
                {place.scope === 'india' ? 'India' : place.country}
              </span>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#090D16]/80 text-amber-400 text-xs font-bold border border-slate-800 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{place.rating}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="relative z-10 p-6 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold tracking-wider uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{place.location}</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {place.tagline}
                </p>
              </div>

              {/* Highlights Bullet Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {place.highlights.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/90 text-slate-300 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" /> {place.bestSeason}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStudioCardClick(place);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all flex items-center gap-1.5 group/btn"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
