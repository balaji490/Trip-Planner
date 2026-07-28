import { Destination, TripStop, StopCategory } from '../types/trip';

// Clean Countries-Only Carousel Dataset for Home Page
export const CURATED_DESTINATIONS: Destination[] = [
  {
    id: 'india-country',
    name: 'India',
    country: 'Asia',
    tagline: 'Taj Mahal, Golden Goa Beaches & Historic Forts',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    description: 'Explore world-famous Taj Mahal, French Quarter White Town in Pondicherry, Goa beach forts, and royal Jaipur palaces.',
    rating: 4.95,
    reviewCount: 9820,
    lat: 15.2993,
    lng: 74.1240,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/India',
    category: 'Heritage & Sightseeing',
    bestSeason: 'October - March',
    flightDuration: 'Direct / Local',
  },
  {
    id: 'france-country',
    name: 'France',
    country: 'Europe',
    tagline: 'Eiffel Tower, Louvre Museum Art & French Riviera',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    description: 'Marvel at the Eiffel Tower, Louvre Mona Lisa, Notre-Dame Cathedral, Arc de Triomphe, and Montmartre Sacré-Cœur.',
    rating: 4.92,
    reviewCount: 8410,
    lat: 48.8566,
    lng: 2.3522,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/France',
    category: 'Famous Art & Landmarks',
    bestSeason: 'Spring / Autumn',
    flightDuration: '7h 45m',
  },
  {
    id: 'japan-country',
    name: 'Japan',
    country: 'Asia',
    tagline: 'Fushimi Inari Torii Shrines, Kinkaku-ji & Bamboo Groves',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    description: 'Walk through 10,000 Fushimi Inari torii gates, Golden Pavilion, Arashiyama Bamboo Forest, and Kiyomizu-dera wooden stage.',
    rating: 4.96,
    reviewCount: 7920,
    lat: 35.0116,
    lng: 135.7681,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/Japan',
    category: 'Ancient Shrines & Temples',
    bestSeason: 'Spring / Autumn',
    flightDuration: '11h 20m',
  },
  {
    id: 'italy-country',
    name: 'Italy',
    country: 'Europe',
    tagline: 'Colosseum in Rome, Amalfi Coast Cliffs & Florence Art',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    description: 'Tour Roman Colosseum & Vatican, drive cliffside Positano villages, and admire Michelangelo\'s David in Florence.',
    rating: 4.91,
    reviewCount: 6540,
    lat: 40.6340,
    lng: 14.6027,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/Italy',
    category: 'Roman Ruins & Coastline',
    bestSeason: 'May - September',
    flightDuration: '9h 10m',
  },
  {
    id: 'greece-country',
    name: 'Greece',
    country: 'Europe',
    tagline: 'Acropolis of Athens, Oia Blue Domes & Aegean Sunsets',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
    description: 'Explore Parthenon ruins in Athens, cliffside Oia windmill sunsets in Santorini, and ancient Delos archaeological sites.',
    rating: 4.94,
    reviewCount: 5890,
    lat: 36.3932,
    lng: 25.4615,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/Greece',
    category: 'Ancient History & Islands',
    bestSeason: 'June - October',
    flightDuration: '10h 30m',
  },
  {
    id: 'switzerland-country',
    name: 'Switzerland',
    country: 'Europe',
    tagline: 'The Matterhorn Summit, Gornergrat Railway & Alpine Peaks',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    description: 'Ride Gornergrat mountain cog railway, view 4,478m Matterhorn summit, and hike surrounding glacial alpine trails.',
    rating: 4.97,
    reviewCount: 4120,
    lat: 45.9765,
    lng: 7.7491,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/Switzerland',
    category: 'Alpine Summits & Glaciers',
    bestSeason: 'Winter / Summer',
    flightDuration: '8h 50m',
  },
  {
    id: 'canada-country',
    name: 'Canada',
    country: 'North America',
    tagline: 'Lake Louise Turquoise Waters & Banff National Park',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    description: 'Canoe across turquoise Lake Louise, ride Banff Gondola to Sulphur Mountain summit, and spot grizzly wildlife.',
    rating: 4.93,
    reviewCount: 3780,
    lat: 51.1784,
    lng: -115.5708,
    quickFactsUrl: 'https://en.wikipedia.org/wiki/Canada',
    category: 'National Parks & Nature',
    bestSeason: 'June - September',
    flightDuration: '4h 15m',
  }
];

// ===========================================================================================
// CITY-STRICT LOCAL LANDMARKS DICTIONARY
// Each city has its OWN dedicated list of famous sights. No cross-city mixing!
// ===========================================================================================
const CITY_LANDMARKS: Record<string, string[]> = {
  // INDIA - INDIVIDUAL CITIES
  'hyderabad': [
    'Charminar Historic Arch Monument',
    'Golconda Fort Hilltop Fortress & Sound Light Show',
    'Hussain Sagar Lake & Buddha Statue Boat Ride',
    'Chowmahalla Palace Royal Nizam Residence',
    'Salar Jung Museum Art & Antiques Gallery',
    'Birla Mandir White Marble Temple Hilltop',
    'Ramoji Film City Studio Tour',
    'Qutb Shahi Tombs Heritage Park',
    'Laad Bazaar Bangles & Pearl Market Walk',
    'Nehru Zoological Park & Natural History Museum',
    'Mecca Masjid Grand Mosque',
    'Shilparamam Arts & Crafts Village',
  ],
  'agra': [
    'Taj Mahal Sunrise White Marble Mausoleum',
    'Agra Fort Red Sandstone Mughal Palace',
    'Mehtab Bagh Moonlight Garden (Taj Mahal View)',
    'Itmad-ud-Daulah (Baby Taj) Marble Tomb',
    'Jama Masjid Agra Grand Mosque',
    'Akbar\'s Tomb Sikandra Heritage Complex',
    'Fatehpur Sikri Ghost City & Buland Darwaza',
    'Kinari Bazaar Old Market Street Walk',
    'Guru Ka Taal Sikh Gurudwara Heritage',
    'Agra Bear Rescue Wildlife SOS Sanctuary',
    'Anguri Bagh Mughal Grape Garden',
    'Mariam\'s Tomb Historical Monument',
  ],
  'jaipur': [
    'Amer Fort (Amber Fort) Palace & Mirror Hall',
    'Hawa Mahal Palace of Winds Pink Facade',
    'City Palace Jaipur Royal Courtyard Museum',
    'Jantar Mantar Stone Observatory Instruments',
    'Nahargarh Fort Sunset Hilltop Panorama',
    'Jal Mahal Water Palace on Man Sagar Lake',
    'Albert Hall Museum Indo-Saracenic Architecture',
    'Birla Planetarium & Science Park',
    'Panna Meena Ka Kund Stepwell',
    'Galtaji Monkey Temple Valley Shrine',
    'Johri Bazaar Gemstone & Jewellery Market Walk',
    'Sisodia Rani Garden & Fountains',
  ],
  'pondicherry': [
    'French Quarter (White Town) Colonial Heritage Walk',
    'Promenade Rock Beach & Gandhi Statue Seashore',
    'Sri Aurobindo Ashram Spiritual Meditation Garden',
    'Matrimandir Golden Globe & Visitor Center (Auroville)',
    'Paradise Beach Chunnambar Ferry Boat Ride',
    'Sacred Heart Basilica Gothic Church',
    'Serenity Beach Sunset & Surfers Overlook',
    'Pondicherry Botanical Garden & Railway Tree Walk',
    'Arikamedu Ancient Roman Trading Port Ruins',
    'Puducherry Museum & Antique French Statues',
    'Our Lady of Angels Church Heritage Quarter',
    'Manakula Vinayagar Temple Ancient Shrine',
  ],
  'goa': [
    'Fort Aguada 17th-Century Portuguese Lighthouse',
    'Basilica of Bom Jesus (UNESCO World Heritage)',
    'Calangute Beach Water Sports & Parasailing',
    'Chapora Fort Sunset Cliff (Dil Chahta Hai Point)',
    'Fontainhas Latin Quarter Portuguese Heritage Walk',
    'Dudhsagar 4-Tiered Waterfall Trek & Spice Farm',
    'Anjuna Flea Market & Coconut Grove Trail',
    'Reis Magos Fort Overlooking Mandovi River',
    'Se Cathedral Old Goa Historic Church',
    'Vagator Beach Red Cliffs & Sunset Lounge',
    'Palolem Beach Crescent Bay Kayaking',
    'Morjim Beach Olive Ridley Turtle Sanctuary',
  ],
  'delhi': [
    'Qutub Minar 73m Sandstone Minaret Complex',
    'Red Fort Lal Qila Mughal Fortress',
    'Humayun\'s Tomb Mughal Garden Mausoleum',
    'India Gate War Memorial & Rajpath Promenade',
    'Lotus Temple Bahai House of Worship',
    'Akshardham Temple Grand Hindu Complex',
    'Jama Masjid Old Delhi Grand Mosque',
    'Chandni Chowk Old Delhi Market Street Walk',
    'Rashtrapati Bhavan President\'s Residence',
    'National Museum Art & Heritage Gallery',
    'Hauz Khas Village Urban Art & Ruins Park',
    'Lodhi Garden Historic Tomb Walk',
  ],
  'mumbai': [
    'Gateway of India Triumphal Arch Monument',
    'Marine Drive Queens Necklace Promenade Walk',
    'Elephanta Caves Ancient Rock-Cut Temple Island',
    'Colaba Causeway Heritage Shopping Street',
    'Haji Ali Dargah Sea-Link Mosque',
    'Chhatrapati Shivaji Terminus Victorian Station',
    'Siddhivinayak Temple Ancient Ganesh Shrine',
    'Juhu Beach Sunset & Street Food Walk',
    'Bandra-Worli Sea Link Bridge Viewpoint',
    'Kanheri Caves Buddhist Rock-Cut Monastery',
    'Crawford Market Heritage Bazaar',
    'Hanging Gardens Malabar Hill Park',
  ],
  'kerala': [
    'Alleppey Backwater Houseboat Cruise',
    'Munnar Tea Plantation Hills & Eravikulam Park',
    'Fort Kochi Chinese Fishing Nets Heritage Walk',
    'Athirapally Waterfalls (Niagara of India)',
    'Periyar Tiger Reserve Bamboo Raft Safari',
    'Varkala Cliff Beach & Papanasam Shore',
    'Kumarakom Bird Sanctuary Boat Tour',
    'Wayanad Edakkal Caves Ancient Petroglyphs',
    'Mattupetty Dam & Echo Point Viewpoint',
    'Marari Beach Serene Fishing Village',
    'Bekal Fort Arabian Sea Fortress',
    'Thiruvananthapuram Padmanabhaswamy Temple',
  ],
  'manali': [
    'Solang Valley Paragliding & Adventure Sports',
    'Rohtang Pass Snow-Capped Mountain Drive',
    'Hadimba Devi Temple Cedar Forest Shrine',
    'Old Manali Village Cafés & River Walk',
    'Jogini Waterfall Forest Hiking Trail',
    'Manu Temple Ancient Sage Heritage Site',
    'Beas River Rafting & Riverside Camping',
    'Vashisht Hot Springs Natural Thermal Bath',
    'Mall Road Kullu Shawl Shopping Promenade',
    'Nehru Kund Natural Mountain Spring',
    'Naggar Castle Heritage Museum',
    'Pandoh Dam Beas River Engineering Marvel',
  ],
  'varanasi': [
    'Dashashwamedh Ghat Evening Ganga Aarti Ceremony',
    'Kashi Vishwanath Temple (Golden Temple)',
    'Manikarnika Ghat Ancient Cremation Ground',
    'Assi Ghat Morning Yoga & Meditation',
    'Sarnath Buddhist Stupa & Deer Park Museum',
    'Ramnagar Fort & Royal Museum across Ganges',
    'Tulsi Manas Mandir Ram Temple',
    'Banaras Hindu University Heritage Campus Walk',
    'Alamgir Mosque (Aurangzeb Mosque) River View',
    'Chunar Fort Ganges Cliff Fortress',
    'Vishwanath Gali Old Market Lane Walk',
    'Man Mandir Ghat Observatory & Sculptures',
  ],

  // INTERNATIONAL CITIES
  'paris': [
    'Eiffel Tower Summit & Champ de Mars Lawn',
    'Musée du Louvre Mona Lisa & Venus de Milo Tour',
    'Notre-Dame Cathedral & Seine River Banks',
    'Arc de Triomphe & Champs-Élysées Boulevard Walk',
    'Montmartre Artists Square & Sacré-Cœur Basilica',
    'Musée d\'Orsay Impressionist Art Galleries',
    'Palace of Versailles Hall of Mirrors & Royal Gardens',
    'Tuileries Garden Sculpture Fountains',
    'Sainte-Chapelle Stained Glass Chapel',
    'Luxembourg Gardens & Medici Fountain',
    'Pont Alexandre III Ornate Bridge Walk',
    'Centre Pompidou Modern Art Museum',
  ],
  'tokyo': [
    'Senso-ji Temple Asakusa Thunder Gate',
    'Tokyo Skytree 634m Observation Tower',
    'Shibuya Crossing & Hachiko Statue Square',
    'Meiji Jingu Shrine Forest Path Walk',
    'Tsukiji Outer Market Sushi & Street Food Tour',
    'Imperial Palace East Gardens Heritage Walk',
    'Akihabara Electric Town Anime District',
    'Shinjuku Gyoen National Cherry Blossom Garden',
    'Harajuku Takeshita Street Fashion Walk',
    'Ueno Park & Tokyo National Museum',
    'Odaiba Rainbow Bridge Waterfront',
    'TeamLab Borderless Digital Art Museum',
  ],
  'kyoto': [
    'Fushimi Inari Taisha 10,000 Vermilion Torii Gates',
    'Kinkaku-ji (Golden Pavilion) & Mirror Pond',
    'Kiyomizu-dera Wooden Stage Overlooking Cherry Trees',
    'Arashiyama Bamboo Forest & Togetsukyo Bridge',
    'Gion Geisha Historic Preservation District Walk',
    'Nijo Castle Nightingale Floors & Shogun Gardens',
    'Philosopher\'s Path Cherry Blossom Canal Walk',
    'Ryoan-ji Zen Rock Garden Temple',
    'Tenryu-ji Temple & Sogenchi Garden',
    'Nishiki Market Traditional Food Alley',
    'Sanjusangen-do Hall of 1001 Statues',
    'Tofuku-ji Autumn Maple Bridge',
  ],
  'rome': [
    'Colosseum Ancient Roman Amphitheatre',
    'Vatican Museums & Sistine Chapel Ceiling',
    'St. Peter\'s Basilica & Vatican Square',
    'Pantheon Ancient Dome Monument',
    'Trevi Fountain Marble Basin & Coin Toss',
    'Roman Forum Ruins & Palatine Hill Walk',
    'Spanish Steps Piazza di Spagna',
    'Piazza Navona Fountain of the Four Rivers',
    'Castel Sant\'Angelo Fortress & Bridge',
    'Borghese Gallery & Villa Gardens',
    'Trastevere Cobblestone Quarter Walk',
    'Mouth of Truth Basilica di Santa Maria',
  ],
  'london': [
    'Tower of London Crown Jewels & White Tower',
    'Buckingham Palace Changing of the Guard',
    'Big Ben & Houses of Parliament Westminster',
    'British Museum Egyptian & Greek Galleries',
    'Tower Bridge Victorian Bascule Bridge Walk',
    'Westminster Abbey Royal Coronation Church',
    'London Eye Thames River Observation Wheel',
    'Hyde Park & Kensington Palace Gardens',
    'St. Paul\'s Cathedral Whispering Gallery',
    'Borough Market Artisan Food & Drink Hall',
    'Natural History Museum Dinosaur Gallery',
    'Covent Garden Street Performers & Market',
  ],
  'new york': [
    'Statue of Liberty & Ellis Island Ferry',
    'Central Park Bethesda Fountain & Bow Bridge',
    'Times Square Neon Lights & Broadway',
    'Empire State Building 86th Floor Observation',
    'Brooklyn Bridge Pedestrian Walkway',
    'Metropolitan Museum of Art (The Met)',
    'Top of the Rock Observation Deck',
    'One World Observatory Freedom Tower',
    'Grand Central Terminal Beaux-Arts Hall',
    'High Line Elevated Park Walk',
    'Fifth Avenue & St. Patrick\'s Cathedral',
    'DUMBO Brooklyn Waterfront & Jane\'s Carousel',
  ],
  'dubai': [
    'Burj Khalifa 148th Floor At The Top Sky',
    'Dubai Mall & Dubai Aquarium Underwater Zoo',
    'Palm Jumeirah Atlantis Waterpark & Beach',
    'Dubai Marina Yacht Walk & JBR Beach',
    'Gold Souk & Spice Souk Deira Market Walk',
    'Dubai Frame 150m Observation Bridge',
    'Burj Al Arab Jumeirah Beach View',
    'Al Fahidi Historical Fort & Dubai Museum',
    'Global Village Cultural Pavilions',
    'Miracle Garden 150 Million Flowers Display',
    'Dubai Creek Abra Traditional Boat Crossing',
    'La Mer Beachfront Art & Street Food District',
  ],
  'singapore': [
    'Marina Bay Sands SkyPark Observation Deck',
    'Gardens by the Bay Supertree Grove Light Show',
    'Sentosa Island Universal Studios & Beach',
    'Merlion Park Waterfront Icon Statue',
    'Chinatown Heritage Centre & Buddha Tooth Relic',
    'Little India Tekka Centre & Sri Veeramakaliamman',
    'Clarke Quay Riverside Dining & Night Walk',
    'Orchard Road Premium Shopping Boulevard',
    'Singapore Botanic Gardens UNESCO Heritage',
    'ArtScience Museum Future World Exhibition',
    'Haji Lane Kampong Glam Street Art Walk',
    'East Coast Park Cycling & Seafood Centre',
  ],
  'bali': [
    'Uluwatu Temple Cliffside Sunset Kecak Dance',
    'Tegallalang Rice Terrace Jungle Swing',
    'Tanah Lot Sea Temple Rock Formation',
    'Ubud Sacred Monkey Forest Sanctuary',
    'Tirta Empul Holy Water Purification Temple',
    'Besakih Mother Temple of Bali',
    'Seminyak Beach Sunset & Beach Club',
    'Kuta Beach Surfing & Seaside Walk',
    'Batur Volcano Sunrise Trek & Hot Springs',
    'Ubud Art Market & Royal Palace',
    'Nusa Penida Kelingking Beach T-Rex Cliff',
    'Waterbom Bali Waterslide Adventure Park',
  ],

  // GENERIC FALLBACK
  'default': [
    'Historic City Centre Heritage Walk',
    'Main Cathedral & Sacred Architecture Tour',
    'Central Market & Local Artisan Bazaar',
    'Famous Hilltop Viewpoint & Sunset Watch',
    'National Museum Art & History Gallery',
    'Central Park & Botanical Garden Walk',
    'Old Town Quarter Cobblestone Street Walk',
    'Riverside Promenade & Bridge Viewpoint',
    'Ancient Fort & Citadel Exploration',
    'Local Heritage Temple & Shrine Visit',
    'Scenic Lake Boating & Nature Trail',
    'Traditional Craft Workshop & Cultural Show',
  ],
};

// Alias keys for flexible matching
const CITY_ALIASES: Record<string, string> = {
  'puducherry': 'pondicherry',
  'pondy': 'pondicherry',
  'new delhi': 'delhi',
  'bengaluru': 'bangalore',
  'mumbai': 'mumbai',
  'bombay': 'mumbai',
  'chennai': 'chennai',
  'madras': 'chennai',
  'kolkata': 'kolkata',
  'calcutta': 'kolkata',
  'alleppey': 'kerala',
  'munnar': 'kerala',
  'kochi': 'kerala',
  'france': 'paris',
  'japan': 'kyoto',
  'italy': 'rome',
  'greece': 'rome',
  'switzerland': 'default',
  'canada': 'default',
  'india': 'delhi',
};

// Resolve the best-matching city key from destination name
function resolveCityKey(destName: string): string {
  const nameLower = destName.toLowerCase().trim();

  // Direct exact match first
  for (const key of Object.keys(CITY_LANDMARKS)) {
    if (nameLower === key || nameLower.includes(key)) {
      return key;
    }
  }

  // Alias match
  for (const [alias, target] of Object.entries(CITY_ALIASES)) {
    if (nameLower === alias || nameLower.includes(alias)) {
      return target;
    }
  }

  return 'default';
}

// ===========================================================================================
// CITY-STRICT ITINERARY GENERATOR
// All stops belong ONLY to the resolved city. Coordinates stay within ±0.003° to ±0.006° (~300m-700m).
// ===========================================================================================
export const generateFullTripStops = (dest: Destination, totalDays: number = 3): TripStop[] => {
  const stops: TripStop[] = [];

  const cityKey = resolveCityKey(dest.name);
  const landmarks = CITY_LANDMARKS[cityKey] || CITY_LANDMARKS['default'];

  // City name for labels (use dest.name for the actual resolved city name)
  const cityLabel = dest.name;

  for (let day = 1; day <= totalDays; day++) {
    // Tiny per-day offset so each day's stops cluster slightly apart
    // but ALL remain strictly within ±0.006° (~700m) of the city center
    const dayLatJitter = ((day % 5) - 2) * 0.0012;
    const dayLngJitter = ((day % 3) - 1) * 0.0015;

    // Day 1 ONLY: Hotel Check-in
    if (day === 1) {
      stops.push({
        id: `stop-${dest.id}-d${day}-stay`,
        dayNumber: day,
        time: '10:30 AM',
        title: `${cityLabel} Hotel & Resort Check-in`,
        description: `Check into luxury room stay in central ${cityLabel}.`,
        category: 'stay',
        lat: dest.lat + dayLatJitter + 0.001,
        lng: dest.lng + dayLngJitter + 0.001,
        locationName: `${cityLabel} Grand Hotel & Room`,
        duration: '1.5h',
        cost: 'Included in Stay'
      });
    }

    // Sightseeing Stop 1 (Morning Famous Sight)
    const sight1 = landmarks[(day * 3 - 3) % landmarks.length];
    stops.push({
      id: `stop-${dest.id}-d${day}-sight1`,
      dayNumber: day,
      time: day === 1 ? '12:00 PM' : '09:00 AM',
      title: `Visit ${sight1}`,
      description: `Explore famous landmark ${sight1} in ${cityLabel} with photo stops and guided walk.`,
      category: 'sightseeing',
      lat: dest.lat + dayLatJitter + 0.003,
      lng: dest.lng + dayLngJitter - 0.002,
      locationName: sight1,
      duration: '2.5h',
      cost: 'Free / Landmark Entry'
    });

    // Meal 1: Lunch (Max 2 meals/day)
    stops.push({
      id: `stop-${dest.id}-d${day}-lunch`,
      dayNumber: day,
      time: '01:30 PM',
      title: `${cityLabel} Regional Specialty Lunch`,
      description: `Sample authentic local food specialties of ${cityLabel}.`,
      category: 'food',
      lat: dest.lat + dayLatJitter + 0.004,
      lng: dest.lng + dayLngJitter + 0.002,
      locationName: `${cityLabel} Traditional Café`,
      duration: '1.5h',
      cost: '$25'
    });

    // Sightseeing Stop 2 (Afternoon Famous Sight)
    const sight2 = landmarks[(day * 3 - 2) % landmarks.length];
    stops.push({
      id: `stop-${dest.id}-d${day}-sight2`,
      dayNumber: day,
      time: '03:30 PM',
      title: `Tour ${sight2}`,
      description: `Discover iconic architecture and cultural sights at ${sight2} in ${cityLabel}.`,
      category: 'sightseeing',
      lat: dest.lat + dayLatJitter - 0.002,
      lng: dest.lng + dayLngJitter + 0.004,
      locationName: sight2,
      duration: '2.5h',
      cost: 'Free'
    });

    // Sightseeing Stop 3 (Sunset Viewpoint / Evening Attraction)
    const sight3 = landmarks[(day * 3 - 1) % landmarks.length];
    stops.push({
      id: `stop-${dest.id}-d${day}-sight3`,
      dayNumber: day,
      time: '06:30 PM',
      title: `Sunset View & Walk at ${sight3}`,
      description: `Watch the sunset over famous scenic overlook at ${sight3} in ${cityLabel}.`,
      category: 'activity',
      lat: dest.lat + dayLatJitter - 0.003,
      lng: dest.lng + dayLngJitter - 0.004,
      locationName: sight3,
      duration: '1.5h',
      cost: 'Free'
    });

    // Meal 2: Dinner (Max 2 meals/day)
    stops.push({
      id: `stop-${dest.id}-d${day}-dinner`,
      dayNumber: day,
      time: '08:30 PM',
      title: `${cityLabel} Evening Dinner & Drinks`,
      description: `Relaxing dinner in central ${cityLabel}.`,
      category: 'food',
      lat: dest.lat + dayLatJitter + 0.001,
      lng: dest.lng + dayLngJitter - 0.003,
      locationName: `${cityLabel} Signature Restaurant`,
      duration: '1.5h',
      cost: '$40'
    });
  }

  return stops;
};

export const MOCK_TRIP_STOPS: Record<string, TripStop[]> = {
  'india-country': generateFullTripStops(CURATED_DESTINATIONS[0], 10),
  'france-country': generateFullTripStops(CURATED_DESTINATIONS[1], 10),
  'japan-country': generateFullTripStops(CURATED_DESTINATIONS[2], 10),
  'italy-country': generateFullTripStops(CURATED_DESTINATIONS[3], 10),
};
