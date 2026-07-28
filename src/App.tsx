import React, { useState } from 'react';
import { CURATED_DESTINATIONS, generateFullTripStops } from './data/mockDestinations';
import { Destination, TripStop, RepeatSchedule } from './types/trip';
import { StateSubRegion } from './data/countryData';
import { NavigationBar, NavTab } from './components/NavigationBar';
import { CountryStateSelector } from './components/CountryStateSelector';
import { DestinationCarousel } from './components/DestinationCarousel';
import { DestinationSearchCard } from './components/ui/3d-card';
import { TripTimeline } from './components/TripTimeline';
import { TripMap } from './components/TripMap';
import { FlashCardSearch } from './components/FlashCardSearch';
import { ExtraPlacesStudio } from './components/ExtraPlacesStudio';
import { Sparkles, Navigation, Search, ArrowRight } from 'lucide-react';

export function App() {
  // Shared Application State (Home Carousel stays fixed to the 7 core countries)
  const [activeDestination, setActiveDestination] = useState<Destination>(CURATED_DESTINATIONS[0]); // India
  const [activeTab, setActiveTab] = useState<NavTab>('discover');

  // Itinerary Planner State
  const [totalDays, setTotalDays] = useState<number>(3);
  const [stops, setStops] = useState<TripStop[]>(generateFullTripStops(CURATED_DESTINATIONS[0], 3));
  const [tripStartDate, setTripStartDate] = useState<string>('2026-11-15');
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');

  // Switch Active Destination & Generate Famous Landmarks Stops
  const handleSelectDestination = (dest: Destination) => {
    setActiveDestination(dest);
    setStops(generateFullTripStops(dest, totalDays));
  };

  // Handle Total Days change (e.g. user selects 3, 5, 7, 10 Days)
  const handleTotalDaysChange = (newDays: number) => {
    setTotalDays(newDays);
    setStops(generateFullTripStops(activeDestination, newDays));
  };

  // Handle Country & State Selection (Routes directly to Itinerary & Map tab)
  const handleSelectSubRegion = (subRegion: StateSubRegion) => {
    const stateDest: Destination = {
      id: subRegion.destinationId,
      name: subRegion.name,
      country: subRegion.countryId.toUpperCase(),
      tagline: subRegion.tagline,
      imageUrl: subRegion.imageUrl,
      description: `Explore famous landmarks, historic quarters, and scenic views in ${subRegion.name}.`,
      rating: 4.94,
      reviewCount: 2850,
      lat: subRegion.destinationId.includes('pondicherry') ? 11.9416 : 15.2993,
      lng: subRegion.destinationId.includes('pondicherry') ? 79.8083 : 74.1240,
      quickFactsUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(subRegion.name)}`,
      category: 'State Explorer',
    };
    setActiveDestination(stateDest);
    setStops(generateFullTripStops(stateDest, totalDays));
    setActiveTab('itinerary-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Plan Trip (Switches tab to Itinerary & Map View)
  const handlePlanTrip = (dest: Destination) => {
    handleSelectDestination(dest);
    setActiveTab('itinerary-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Global Search Selection (Routes directly to Itinerary & Map tab)
  const handleSelectSearchResult = (searchedDest: Destination) => {
    setActiveDestination(searchedDest);
    setStops(generateFullTripStops(searchedDest, totalDays));
    setActiveTab('itinerary-map');
  };

  // Add Stop Handler
  const handleAddStop = (newStopData: Omit<TripStop, 'id'>) => {
    const newStop: TripStop = {
      ...newStopData,
      id: `stop-${Date.now()}`,
    };
    setStops(prev => [...prev, newStop]);
  };

  // Add Stop via Map Click
  const handleAddStopAtLocation = (lat: number, lng: number) => {
    const day = activeDayFilter === 'all' ? 1 : activeDayFilter;
    const newStop: TripStop = {
      id: `stop-map-${Date.now()}`,
      dayNumber: day,
      time: '02:00 PM',
      title: `Famous Landmark Waypoint in ${activeDestination.name}`,
      description: `Custom location pinned directly on map.`,
      category: 'sightseeing',
      lat,
      lng,
      locationName: `Pinned Spot (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      duration: '1h',
    };
    setStops(prev => [...prev, newStop]);
    setSelectedStopId(newStop.id);
  };

  // Delete Stop Handler
  const handleDeleteStop = (stopId: string) => {
    setStops(prev => prev.filter(s => s.id !== stopId));
    if (selectedStopId === stopId) setSelectedStopId(null);
  };

  // Apply AI Generated Trip Plan
  const handleApplyAITripPlan = (
    destination: Destination,
    generatedStops: TripStop[],
    generatedDays: number,
    startDate: string
  ) => {
    setActiveDestination(destination);
    setStops(generatedStops);
    setTotalDays(generatedDays);
    setTripStartDate(startDate);
    setActiveTab('itinerary-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Recurring Scheduler Handler
  const handleApplyRecurringActivity = (schedule: RepeatSchedule) => {
    const newStops: TripStop[] = [];

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      let shouldAdd = false;
      if (schedule.repeatInterval === 'daily') {
        shouldAdd = true;
      } else if (schedule.repeatInterval === 'weekly') {
        const dayIndex = (dayNum - 1) % 7;
        if (schedule.daysOfWeek.includes(dayIndex)) {
          shouldAdd = true;
        }
      }

      if (shouldAdd) {
        newStops.push({
          id: `recurring-${dayNum}-${Date.now()}`,
          dayNumber: dayNum,
          time: schedule.preferredTime || '08:30 AM',
          title: schedule.activityTitle,
          description: `Recurring ${schedule.repeatInterval} activity.`,
          category: schedule.activityCategory,
          lat: activeDestination.lat + (Math.random() * 0.01 - 0.005),
          lng: activeDestination.lng + (Math.random() * 0.01 - 0.005),
          locationName: `${activeDestination.name} Spot`,
          duration: '1h',
        });
      }
    }

    setStops(prev => [...prev, ...newStops]);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-violet-500 selection:text-white pb-16">
      {/* Multi-Tab Navigation Header */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeDestination={activeDestination}
        onSelectSearchResult={handleSelectSearchResult}
        onAddToTrip={(dest) => handlePlanTrip(dest)}
      />

      {/* Main Tabbed Content Area */}
      <main className="w-full">
        {/* TAB 1: DISCOVER PAGE */}
        {activeTab === 'discover' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* HERO CAROUSEL AT THE TOP (PRISTINE COUNTRIES ONLY) */}
            <DestinationCarousel
              destinations={CURATED_DESTINATIONS}
              activeDestination={activeDestination}
              onSelectDestination={handleSelectDestination}
              onPlanTrip={handlePlanTrip}
            />

            {/* COUNTRY & STATE EXPLORER DIRECTLY BELOW CAROUSEL */}
            <CountryStateSelector
              onSelectSubRegion={handleSelectSubRegion}
              selectedDestinationId={activeDestination.id}
            />

            {/* Interactive 3D Destination Card Section */}
            <section className="relative max-w-7xl mx-auto px-6 py-10 rounded-3xl bg-[#0F1629]/80 border border-violet-500/30 backdrop-blur-md shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 text-cyan-400 border border-violet-500/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Featured 3D Interactive Card
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Experience {activeDestination.name} in 3D Perspective
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hover over the card to engage Framer Motion spring tilt. Click <strong className="text-cyan-400">"Plan a trip here"</strong> to view famous landmarks to visit and travel times mapped out!
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#090D16]/90 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Best Season</span>
                      <p className="text-sm font-bold text-white">{activeDestination.bestSeason || 'Year-round'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#090D16]/90 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Rating & Reviews</span>
                      <p className="text-sm font-bold text-amber-400">★ {activeDestination.rating} ({activeDestination.reviewCount.toLocaleString()})</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handlePlanTrip(activeDestination)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 transition-all flex items-center gap-2"
                    >
                      <span>Build {totalDays}-Day Way Finder Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('flash-plan')}
                      className="px-6 py-3.5 rounded-2xl bg-[#090D16] hover:bg-slate-900 text-cyan-400 border border-violet-500/30 font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Flash Plan {activeDestination.name}</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <DestinationSearchCard
                    destination={activeDestination}
                    onActionClick={handlePlanTrip}
                    actionText={`Plan Trip to ${activeDestination.name}`}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: WAY FINDER STUDIO & EXTRA PLACES */}
        {activeTab === 'studio' && (
          <div className="animate-in fade-in duration-300">
            <ExtraPlacesStudio onPlanDestination={handlePlanTrip} />
          </div>
        )}

        {/* TAB 3: FLASH PLAN — Instant Search to Route Map */}
        {activeTab === 'flash-plan' && (
          <div className="animate-in fade-in duration-300">
            <FlashCardSearch onApplyTripPlan={handleApplyAITripPlan} />
          </div>
        )}

        {/* TAB 4: ITINERARY AGENDA & INTERACTIVE ROUTE MAP PAGE */}
        {activeTab === 'itinerary-map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 text-cyan-400 border border-violet-500/30 text-xs font-bold">
                <Navigation className="w-3.5 h-3.5" /> Way Finder Route Engine
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                {activeDestination.name} ({totalDays} Days Famous Sights & Map Route)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Starting Date: <strong className="text-cyan-400">{tripStartDate}</strong> • 3-4 famous landmark sights per day with inter-stop travel times & route polylines!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Timeline Agenda & Repeat Scheduler */}
              <div className="lg:col-span-7">
                <TripTimeline
                  destination={activeDestination}
                  stops={stops}
                  totalDays={totalDays}
                  onTotalDaysChange={handleTotalDaysChange}
                  onAddStop={handleAddStop}
                  onDeleteStop={handleDeleteStop}
                  onSelectStopOnMap={(stop) => setSelectedStopId(stop.id)}
                  selectedStopId={selectedStopId}
                  activeDayFilter={activeDayFilter}
                  onActiveDayFilterChange={setActiveDayFilter}
                  onApplyRecurringActivity={handleApplyRecurringActivity}
                />
              </div>

              {/* Right Column: Sticky Interactive Leaflet Route Map */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <TripMap
                  destination={activeDestination}
                  stops={stops}
                  selectedStopId={selectedStopId}
                  activeDayFilter={activeDayFilter}
                  onSelectStop={(stop) => setSelectedStopId(stop.id)}
                  onAddStopAtLocation={handleAddStopAtLocation}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Flash Plan Trigger Button */}
      {activeTab !== 'flash-plan' && (
        <button
          type="button"
          onClick={() => setActiveTab('flash-plan')}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all flex items-center gap-2 border border-violet-300/30"
        >
          <Search className="w-4 h-4 animate-bounce text-cyan-400" />
          <span>Flash Plan a Trip</span>
        </button>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060911] py-8 text-center text-xs text-slate-500 space-y-2 mt-12">
        <p>© 2026 Way Finder. Built with React, TypeScript, Tailwind CSS, Groq Llama 3.3 AI & Leaflet Route Engine.</p>
        <p className="text-slate-600">Way Finder Studio • Pristine Countries Carousel • Inter-Stop Travel Time Estimator</p>
      </footer>
    </div>
  );
}

export default App;
