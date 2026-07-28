import React, { useState } from 'react';
import { Destination, TripStop, RepeatSchedule, StopCategory } from '../types/trip';
import { TripRepeatScheduler } from './ui/scheduler';
import { estimateTravelTime } from '../utils/distance';
import { Calendar, Clock, MapPin, Plus, Trash2, Utensils, Landmark, Compass, Hotel, Car, CheckCircle2, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

interface TripTimelineProps {
  destination: Destination;
  stops: TripStop[];
  totalDays: number;
  onTotalDaysChange: (days: number) => void;
  onAddStop: (stop: Omit<TripStop, 'id'>) => void;
  onDeleteStop: (stopId: string) => void;
  onSelectStopOnMap: (stop: TripStop) => void;
  selectedStopId: string | null;
  activeDayFilter: number | 'all';
  onActiveDayFilterChange: (day: number | 'all') => void;
  onApplyRecurringActivity: (schedule: RepeatSchedule) => void;
}

const CATEGORY_ICONS: Record<StopCategory, React.ReactNode> = {
  food: <Utensils className="w-3.5 h-3.5 text-amber-400" />,
  sightseeing: <Landmark className="w-3.5 h-3.5 text-cyan-400" />,
  activity: <Compass className="w-3.5 h-3.5 text-emerald-400" />,
  stay: <Hotel className="w-3.5 h-3.5 text-violet-400" />,
  transport: <Car className="w-3.5 h-3.5 text-indigo-400" />,
};

const CATEGORY_COLORS: Record<StopCategory, string> = {
  food: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  sightseeing: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  activity: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  stay: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  transport: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
};

export const TripTimeline: React.FC<TripTimelineProps> = ({
  destination,
  stops,
  totalDays,
  onTotalDaysChange,
  onAddStop,
  onDeleteStop,
  onSelectStopOnMap,
  selectedStopId,
  activeDayFilter,
  onActiveDayFilterChange,
  onApplyRecurringActivity,
}) => {
  // Local state for adding a new stop
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDayNum, setNewDayNum] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newCategory, setNewCategory] = useState<StopCategory>('sightseeing');
  const [newLocationName, setNewLocationName] = useState('');
  const [newDuration, setNewDuration] = useState('1.5h');

  // Recurring scheduler local state
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3, 5]);
  const [recurringTitle, setRecurringTitle] = useState('');
  const [recurringCategory, setRecurringCategory] = useState<StopCategory>('activity');

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddStop({
      dayNumber: newDayNum,
      title: newTitle,
      time: newTime,
      category: newCategory,
      locationName: newLocationName || destination.name,
      lat: destination.lat + (Math.random() * 0.02 - 0.01),
      lng: destination.lng + (Math.random() * 0.02 - 0.01),
      duration: newDuration,
    });

    setNewTitle('');
    setNewLocationName('');
    setShowAddForm(false);
  };

  const handleApplyRecurring = () => {
    if (!recurringTitle.trim()) return;
    onApplyRecurringActivity({
      isRepeating,
      repeatInterval,
      daysOfWeek,
      activityTitle: recurringTitle,
      activityCategory: recurringCategory,
      preferredTime: '08:30 AM',
    });
    setRecurringTitle('');
    setIsRepeating(false);
  };

  // Filter stops by day
  const filteredStops = activeDayFilter === 'all'
    ? stops
    : stops.filter(s => s.dayNumber === activeDayFilter);

  return (
    <div className="w-full space-y-6 text-slate-100">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-[#0F1629]/90 border border-violet-500/30 backdrop-blur-md shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.country}</span>
              <span>•</span>
              <span>{destination.name} Itinerary</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {destination.name} Timeline Agenda
            </h2>
          </div>

          {/* Trip Duration Counter / Selector */}
          <div className="flex items-center gap-3 bg-[#090D16]/90 p-2 rounded-2xl border border-slate-800">
            <Calendar className="w-4 h-4 text-cyan-400 ml-2" />
            <span className="text-xs font-medium text-slate-300">Trip Length:</span>
            <div className="flex items-center gap-1">
              {[3, 5, 7, 10].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => onTotalDaysChange(days)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    totalDays === days
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => onActiveDayFilterChange('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5",
              activeDayFilter === 'all'
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25"
                : "bg-[#090D16]/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> All Days ({stops.length} stops)
          </button>

          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
            const count = stops.filter(s => s.dayNumber === dayNum).length;
            const isSelected = activeDayFilter === dayNum;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => onActiveDayFilterChange(dayNum)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-1 ring-violet-300/40"
                    : "bg-[#090D16]/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                )}
              >
                <span>Day {dayNum}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Repeating Scheduler Section */}
      <TripRepeatScheduler
        isRepeating={isRepeating}
        onIsRepeatingChange={setIsRepeating}
        repeatInterval={repeatInterval}
        onRepeatIntervalChange={setRepeatInterval}
        daysOfWeek={daysOfWeek}
        onDaysOfWeekChange={setDaysOfWeek}
        activityTitle={recurringTitle}
        onActivityTitleChange={setRecurringTitle}
        activityCategory={recurringCategory}
        onActivityCategoryChange={setRecurringCategory}
        onAddRecurringActivity={handleApplyRecurring}
      />

      {/* Main Timeline Agenda View */}
      <div className="p-6 rounded-3xl bg-[#0F1629]/90 border border-violet-500/30 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            {activeDayFilter === 'all' ? 'Complete Trip Agenda' : `Day ${activeDayFilter} Itinerary`}
          </h3>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" /> Add Landmark Stop
          </button>
        </div>

        {/* Add Stop Form Dropdown */}
        {showAddForm && (
          <form onSubmit={handleCreateStop} className="p-5 rounded-2xl bg-[#090D16]/90 border border-violet-500/40 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <h4 className="text-sm font-semibold text-cyan-400">Add New Activity / Place to Visit</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400">Day</label>
                <select
                  value={newDayNum}
                  onChange={(e) => setNewDayNum(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  {Array.from({ length: totalDays }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  placeholder="e.g. 10:30 AM"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as StopCategory)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  <option value="sightseeing">🏛️ Sightseeing / Landmark</option>
                  <option value="activity">✨ Activity</option>
                  <option value="food">🍽️ Food (Max 2/day)</option>
                  <option value="stay">🏨 Hotel / Stay</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400">Famous Place / Landmark Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  placeholder="e.g. Visit Taj Mahal / Promenade Rock Beach"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Location Name</label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  placeholder="e.g. Historic Quarter"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
              >
                Save Stop
              </button>
            </div>
          </form>
        )}

        {/* Timeline Activities Vertical List */}
        {filteredStops.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
            <p className="text-sm">No activities scheduled for this day yet.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-cyan-500 before:to-slate-800">
            {filteredStops.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              const prevStop = idx > 0 ? filteredStops[idx - 1] : null;
              const travelInfo = prevStop ? estimateTravelTime(prevStop.lat, prevStop.lng, stop.lat, stop.lng) : null;

              return (
                <React.Fragment key={stop.id}>
                  {/* Inter-Stop Travel Time & Distance Badge */}
                  {travelInfo && (
                    <div className="my-2 ml-2 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-[#090D16] border border-violet-500/30 text-[11px] font-semibold text-cyan-300 shadow-md flex items-center gap-1.5">
                        <span>{travelInfo.text}</span>
                        <span className="text-slate-500">• Next Stop Travel</span>
                      </div>
                    </div>
                  )}

                  <div
                    onClick={() => onSelectStopOnMap(stop)}
                    className={cn(
                      "relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                      isSelected
                        ? "bg-[#090D16] border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                        : "bg-[#090D16]/60 border-slate-800 hover:border-violet-500/40 hover:bg-[#090D16]/90"
                    )}
                  >
                    {/* Node Bullet */}
                    <div
                      className={cn(
                        "absolute -left-[31px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        isSelected
                          ? "bg-cyan-400 border-white ring-4 ring-cyan-400/30 scale-110"
                          : "bg-slate-900 border-violet-500 group-hover:bg-violet-500"
                      )}
                    />

                    {/* Main Info */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-cyan-400 font-mono text-xs font-semibold border border-slate-800">
                          {stop.time}
                        </span>

                        <span className={cn("px-2.5 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 capitalize", CATEGORY_COLORS[stop.category])}>
                          {CATEGORY_ICONS[stop.category]}
                          <span>{stop.category}</span>
                        </span>

                        {activeDayFilter === 'all' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600/30 text-violet-300 border border-violet-500/30">
                            Day {stop.dayNumber}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {stop.title}
                      </h4>

                      {stop.description && (
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {stop.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {stop.locationName}
                        </span>
                        {stop.duration && (
                          <span>• {stop.duration}</span>
                        )}
                        {stop.cost && (
                          <span>• {stop.cost}</span>
                        )}
                      </div>
                    </div>

                    {/* Focus Map Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStopOnMap(stop);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-violet-600 hover:text-white border border-slate-800 text-xs text-slate-300 transition-all flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                        <span>Focus Map</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStop(stop.id);
                        }}
                        title="Delete activity"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
