import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Repeat, Calendar, Clock, Sparkles } from 'lucide-react';
import { StopCategory } from '@/types/trip';

interface SwapTextProps {
  active: boolean;
  activeText: string;
  inactiveText: string;
  className?: string;
}

export const SwapText: React.FC<SwapTextProps> = ({
  active,
  activeText,
  inactiveText,
  className
}) => {
  return (
    <div className={cn("relative overflow-hidden inline-flex items-center justify-center font-medium transition-colors duration-300", className)}>
      <span
        className={cn(
          "transition-all duration-300 transform inline-block",
          active ? "opacity-100 translate-y-0 scale-100 font-semibold" : "opacity-0 -translate-y-2 scale-95 absolute"
        )}
      >
        {activeText}
      </span>
      <span
        className={cn(
          "transition-all duration-300 transform inline-block",
          !active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 absolute"
        )}
      >
        {inactiveText}
      </span>
    </div>
  );
};

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const CustomSwitch: React.FC<SwitchProps> = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900",
        checked ? "bg-gradient-to-r from-sky-500 to-indigo-500" : "bg-slate-700/80",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

export interface TripRepeatSchedulerProps {
  isRepeating: boolean;
  onIsRepeatingChange: (val: boolean) => void;
  repeatInterval: 'daily' | 'weekly' | 'monthly';
  onRepeatIntervalChange: (interval: 'daily' | 'weekly' | 'monthly') => void;
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  onDaysOfWeekChange: (days: number[]) => void;
  activityTitle?: string;
  onActivityTitleChange?: (title: string) => void;
  activityCategory?: StopCategory;
  onActivityCategoryChange?: (cat: StopCategory) => void;
  onAddRecurringActivity?: () => void;
  className?: string;
}

const DAYS = [
  { label: 'S', short: 'Sun', full: 'Sunday', val: 0 },
  { label: 'M', short: 'Mon', full: 'Monday', val: 1 },
  { label: 'T', short: 'Tue', full: 'Tuesday', val: 2 },
  { label: 'W', short: 'Wed', full: 'Wednesday', val: 3 },
  { label: 'T', short: 'Thu', full: 'Thursday', val: 4 },
  { label: 'F', short: 'Fri', full: 'Friday', val: 5 },
  { label: 'S', short: 'Sat', full: 'Saturday', val: 6 },
];

export const TripRepeatScheduler: React.FC<TripRepeatSchedulerProps> = ({
  isRepeating,
  onIsRepeatingChange,
  repeatInterval,
  onRepeatIntervalChange,
  daysOfWeek,
  onDaysOfWeekChange,
  activityTitle = '',
  onActivityTitleChange,
  activityCategory = 'activity',
  onActivityCategoryChange,
  onAddRecurringActivity,
  className
}) => {
  const toggleDay = (dayVal: number) => {
    if (daysOfWeek.includes(dayVal)) {
      onDaysOfWeekChange(daysOfWeek.filter(d => d !== dayVal));
    } else {
      onDaysOfWeekChange([...daysOfWeek, dayVal].sort());
    }
  };

  return (
    <div className={cn("p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl text-slate-100", className)}>
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">Recurring Trip Activity</h4>
            <p className="text-xs text-slate-400">Schedule repeated events (breakfast, tours, gym)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300">
            {isRepeating ? 'Repeating ON' : 'One-time'}
          </span>
          <CustomSwitch checked={isRepeating} onCheckedChange={onIsRepeatingChange} />
        </div>
      </div>

      {isRepeating && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Activity title & category input */}
          {onActivityTitleChange && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Activity Title</label>
                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => onActivityTitleChange(e.target.value)}
                  placeholder="e.g. Daily Sunset Cocktail Hour"
                  className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={activityCategory}
                  onChange={(e) => onActivityCategoryChange?.(e.target.value as StopCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="food">🍽️ Food & Drink</option>
                  <option value="sightseeing">🏛️ Sightseeing</option>
                  <option value="activity">✨ Activity</option>
                  <option value="stay">🏨 Hotel / Stay</option>
                  <option value="transport">🚕 Transport</option>
                </select>
              </div>
            </div>
          )}

          {/* Frequency interval selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> Repeat Frequency
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 rounded-xl border border-slate-800">
              {(['daily', 'weekly', 'monthly'] as const).map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => onRepeatIntervalChange(interval)}
                  className={cn(
                    "py-1.5 text-xs font-medium rounded-lg capitalize transition-all duration-200",
                    repeatInterval === interval
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Day of Week Selector */}
          {repeatInterval === 'weekly' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Select Days
              </label>
              <div className="flex items-center justify-between gap-1">
                {DAYS.map((day) => {
                  const isSelected = daysOfWeek.includes(day.val);
                  return (
                    <button
                      key={day.val}
                      type="button"
                      onClick={() => toggleDay(day.val)}
                      className={cn(
                        "flex-1 h-9 rounded-lg border text-xs flex items-center justify-center transition-all duration-300 relative overflow-hidden group",
                        isSelected
                          ? "bg-gradient-to-b from-sky-500 to-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/25 ring-1 ring-sky-300/40"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      )}
                    >
                      <SwapText
                        active={isSelected}
                        activeText={day.short}
                        inactiveText={day.label}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {onAddRecurringActivity && (
            <button
              type="button"
              onClick={onAddRecurringActivity}
              disabled={!activityTitle.trim()}
              className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> Apply Recurring Activity to Trip Agenda
            </button>
          )}
        </div>
      )}
    </div>
  );
};
