import React, { useState } from 'react';
import { Destination, TripStop } from '../types/trip';
import { generateFullTripStops } from '../data/mockDestinations';
import { Search, MapPin, Calendar, Loader2, Compass, ArrowRight, Sparkles, Clock, Mountain, Waves, Heart, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface FlashCardSearchProps {
  onApplyTripPlan: (destination: Destination, stops: TripStop[], totalDays: number, startDate: string) => void;
  className?: string;
}



const QUICK_PICKS = [
  { name: 'Pondicherry', days: 3, icon: Waves },
  { name: 'Jaipur', days: 4, icon: Mountain },
  { name: 'Hyderabad', days: 3, icon: Sparkles },
  { name: 'Goa', days: 5, icon: Waves },
  { name: 'Paris', days: 5, icon: Heart },
  { name: 'Tokyo', days: 4, icon: Zap },
  { name: 'Dubai', days: 3, icon: Sparkles },
  { name: 'Manali', days: 4, icon: Mountain },
  { name: 'Bali', days: 5, icon: Waves },
  { name: 'London', days: 4, icon: Compass },
  { name: 'Kerala', days: 5, icon: Waves },
  { name: 'Varanasi', days: 3, icon: Sparkles },
];

// Build TripStop[] from AI-generated landmarks with tight city-radius coordinates
function buildStopsFromAILandmarks(
  dest: Destination,
  landmarks: string[],
  totalDays: number
): TripStop[] {
  const stops: TripStop[] = [];
  let landmarkIdx = 0;

  const getNext = (): string => {
    const lm = landmarks[landmarkIdx % landmarks.length];
    landmarkIdx++;
    return lm;
  };

  for (let day = 1; day <= totalDays; day++) {
    const dLat = ((day % 5) - 2) * 0.0012;
    const dLng = ((day % 3) - 1) * 0.0015;

    if (day === 1) {
      stops.push({
        id: `stop-${dest.id}-d${day}-stay`,
        dayNumber: day, time: '10:30 AM',
        title: `${dest.name} Hotel & Resort Check-in`,
        description: `Check into luxury room stay in central ${dest.name}.`,
        category: 'stay',
        lat: dest.lat + dLat + 0.001, lng: dest.lng + dLng + 0.001,
        locationName: `${dest.name} Grand Hotel & Room`,
        duration: '1.5h', cost: 'Included in Stay'
      });
    }

    const s1 = getNext();
    stops.push({
      id: `stop-${dest.id}-d${day}-s1`, dayNumber: day,
      time: day === 1 ? '12:00 PM' : '09:00 AM',
      title: `Visit ${s1}`,
      description: `Explore famous landmark ${s1} in ${dest.name}.`,
      category: 'sightseeing',
      lat: dest.lat + dLat + 0.003, lng: dest.lng + dLng - 0.002,
      locationName: s1, duration: '2.5h', cost: 'Free / Entry'
    });

    stops.push({
      id: `stop-${dest.id}-d${day}-lunch`, dayNumber: day, time: '01:30 PM',
      title: `${dest.name} Regional Specialty Lunch`,
      description: `Sample authentic local food specialties of ${dest.name}.`,
      category: 'food',
      lat: dest.lat + dLat + 0.004, lng: dest.lng + dLng + 0.002,
      locationName: `${dest.name} Traditional Café`,
      duration: '1.5h', cost: '$25'
    });

    const s2 = getNext();
    stops.push({
      id: `stop-${dest.id}-d${day}-s2`, dayNumber: day, time: '03:30 PM',
      title: `Tour ${s2}`,
      description: `Discover iconic architecture and cultural sights at ${s2} in ${dest.name}.`,
      category: 'sightseeing',
      lat: dest.lat + dLat - 0.002, lng: dest.lng + dLng + 0.004,
      locationName: s2, duration: '2.5h', cost: 'Free'
    });

    const s3 = getNext();
    stops.push({
      id: `stop-${dest.id}-d${day}-s3`, dayNumber: day, time: '06:30 PM',
      title: `Sunset View & Walk at ${s3}`,
      description: `Watch the sunset at ${s3} in ${dest.name}.`,
      category: 'activity',
      lat: dest.lat + dLat - 0.003, lng: dest.lng + dLng - 0.004,
      locationName: s3, duration: '1.5h', cost: 'Free'
    });

    stops.push({
      id: `stop-${dest.id}-d${day}-dinner`, dayNumber: day, time: '08:30 PM',
      title: `${dest.name} Evening Dinner & Drinks`,
      description: `Relaxing dinner in central ${dest.name}.`,
      category: 'food',
      lat: dest.lat + dLat + 0.001, lng: dest.lng + dLng - 0.003,
      locationName: `${dest.name} Signature Restaurant`,
      duration: '1.5h', cost: '$40'
    });
  }

  return stops;
}

export const FlashCardSearch: React.FC<FlashCardSearchProps> = ({ onApplyTripPlan, className }) => {
  const [placeName, setPlaceName] = useState('');
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState('2026-11-15');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (overrideName?: string, overrideDays?: number) => {
    const searchPlace = (overrideName || placeName).trim();
    const totalDays = overrideDays || days;
    if (!searchPlace) return;

    setIsLoading(true);

    try {
      const landmarksNeeded = totalDays * 3;

      // 1. Geocode with OpenStreetMap Nominatim
      let realLat = 20.5937;
      let realLng = 78.9629;
      let resolvedName = searchPlace;
      let countryName = 'Global';

      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchPlace)}&limit=1&addressdetails=1`
        );
        const geoData = await geoRes.json();
        if (geoData?.length > 0) {
          const item = geoData[0];
          realLat = parseFloat(item.lat);
          realLng = parseFloat(item.lon);
          if (item.address) {
            resolvedName = item.address.city || item.address.town || item.address.village || item.address.state || item.display_name.split(',')[0].trim();
          } else {
            resolvedName = item.display_name.split(',')[0].trim();
          }
          countryName = item.address?.country || item.display_name.split(',').pop()?.trim() || 'Global';
        }
      } catch (e) {
        console.warn('Geocoding fallback:', e);
      }

      // 2. Ask Groq AI for real landmarks via Server Proxy / Serverless Function
      let aiLandmarks: string[] = [];

      try {
        const payload = {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a travel landmark expert. Return ONLY a valid JSON object (no markdown, no code fences) in this exact format:
{"landmarks": ["Landmark 1", "Landmark 2", ...]}
Rules:
- Return EXACTLY ${landmarksNeeded} landmarks.
- Every landmark MUST be a real, famous place located IN "${resolvedName}, ${countryName}". No other cities.
- Include temples, forts, beaches, parks, museums, viewpoints, markets that actually exist there.
- Return ONLY the JSON. No other text.`
            },
            {
              role: 'user',
              content: `List ${landmarksNeeded} famous tourist landmarks in ${resolvedName}, ${countryName}.`
            }
          ],
          temperature: 0.3,
        };

        // All AI calls go through the backend proxy only — never directly to Groq
        const groqRes = await fetch('/api/groq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const raw = data.choices?.[0]?.message?.content || '';
          try {
            const jsonStr = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
            const parsed = JSON.parse(jsonStr);
            if (parsed.landmarks?.length > 0) {
              aiLandmarks = parsed.landmarks.map((lm: string) => lm.trim()).filter((lm: string) => lm.length > 0);
            }
          } catch {
            console.warn('Groq JSON parse fallback');
          }
        }
      } catch (err) {
        console.warn('Groq proxy error:', err);
      }

      // 3. Build destination
      const dest: Destination = {
        id: `dest-${resolvedName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: resolvedName,
        country: countryName,
        tagline: `${totalDays}-Day Way Finder Plan for ${resolvedName}`,
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
        description: `Custom ${totalDays}-day itinerary for ${resolvedName}, ${countryName}.`,
        rating: 4.96,
        reviewCount: 3120,
        lat: realLat,
        lng: realLng,
        quickFactsUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(resolvedName)}`,
        category: 'Way Finder AI',
      };

      // 4. Generate stops
      const stops = aiLandmarks.length >= 3
        ? buildStopsFromAILandmarks(dest, aiLandmarks, totalDays)
        : generateFullTripStops(dest, totalDays);

      // 5. Immediately apply — no chat messages, straight to itinerary+map
      onApplyTripPlan(dest, stops, totalDays, startDate);
    } catch (err) {
      console.error('Flash plan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10", className)}>
      {/* Hero Search Card */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-violet-950/90 via-[#0F1629] to-cyan-950/90 border border-violet-500/40 shadow-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-cyan-300 text-xs font-bold backdrop-blur-md">
              <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Way Finder Flash Plan</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Where do you want to go?
            </h2>

            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Type any place in the world, pick your days, and get an instant itinerary with real famous landmarks and a route map.
            </p>
          </div>

          {/* Search Input Row */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-3xl mx-auto">
            {/* Place Input */}
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && placeName.trim()) handleGeneratePlan(); }}
                placeholder="Enter any city, state, or village..."
                className="w-full pl-12 pr-4 py-4 text-sm sm:text-base bg-[#090D16]/90 text-white placeholder-slate-400 border border-violet-500/30 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-md shadow-xl transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Days Selector */}
            <div className="relative shrink-0">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="w-full sm:w-32 pl-10 pr-3 py-4 text-sm bg-[#090D16]/90 text-white border border-violet-500/30 rounded-2xl focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
                disabled={isLoading}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14].map(d => (
                  <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="relative shrink-0">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-44 pl-10 pr-3 py-4 text-sm bg-[#090D16]/90 text-white border border-violet-500/30 rounded-2xl focus:outline-none focus:border-cyan-400 font-mono"
                disabled={isLoading}
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={() => handleGeneratePlan()}
              disabled={!placeName.trim() || isLoading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-violet-500/30 transition-all flex items-center justify-center gap-2 shrink-0 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Generate Plan</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Pick Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Quick Picks — One-Tap Instant Plans</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {QUICK_PICKS.map((pick) => {
            const IconComp = pick.icon;
            return (
              <button
                key={pick.name}
                type="button"
                onClick={() => {
                  setPlaceName(pick.name);
                  setDays(pick.days);
                  handleGeneratePlan(pick.name, pick.days);
                }}
                disabled={isLoading}
                className="group relative p-4 rounded-2xl bg-[#0F1629]/80 border border-slate-800 hover:border-violet-500/50 shadow-lg hover:shadow-violet-500/20 transition-all duration-300 text-left space-y-2 disabled:opacity-40 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComp className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">{pick.name}</p>
                  <p className="text-[11px] text-slate-400">{pick.days} Days Plan</p>
                </div>
                <ArrowRight className="absolute top-4 right-4 w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
