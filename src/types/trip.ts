export type StopCategory = 'food' | 'sightseeing' | 'stay' | 'transport' | 'activity';

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  imageUrl: string;
  description: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  quickFactsUrl: string;
  category: string;
  bestSeason?: string;
  flightDuration?: string;
}

export interface TripStop {
  id: string;
  dayNumber: number;
  time: string;
  title: string;
  description?: string;
  category: StopCategory;
  lat: number;
  lng: number;
  locationName: string;
  duration?: string;
  cost?: string;
}

export interface RepeatSchedule {
  isRepeating: boolean;
  repeatInterval: 'daily' | 'weekly' | 'monthly';
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  activityTitle: string;
  activityCategory: StopCategory;
  preferredTime: string;
}

export interface PlannerState {
  activeDestination: Destination;
  tripStartDate: string;
  tripEndDate: string;
  totalDays: number;
  stops: TripStop[];
  repeatSchedules: RepeatSchedule[];
  selectedStopId: string | null;
  activeDayFilter: number | 'all';
}
