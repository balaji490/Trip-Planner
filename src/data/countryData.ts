export interface StateSubRegion {
  id: string;
  name: string;
  countryId: string;
  tagline: string;
  destinationId: string;
  imageUrl: string;
}

export interface CountryItem {
  id: string;
  name: string;
  flag: string;
  states: StateSubRegion[];
}

export const COUNTRIES_DATA: CountryItem[] = [
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    states: [
      {
        id: 'pondicherry-state',
        name: 'Pondicherry (Puducherry)',
        countryId: 'india',
        tagline: 'French Colonial Architecture & Quiet Promenade Beaches',
        destinationId: 'pondicherry-india',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'goa-state',
        name: 'Goa',
        countryId: 'india',
        tagline: 'Golden Beaches, Portuguese Forts & Seafood Shacks',
        destinationId: 'goa-india',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'kerala-state',
        name: 'Kerala (Backwaters)',
        countryId: 'india',
        tagline: 'Serene Houseboats & Tea Plantations in Munnar',
        destinationId: 'kerala-india',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'rajasthan-state',
        name: 'Rajasthan (Jaipur)',
        countryId: 'india',
        tagline: 'Pink City Forts, Royal Palaces & Desert Safari',
        destinationId: 'rajasthan-india',
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    states: [
      {
        id: 'paris-region',
        name: 'Paris (Île-de-France)',
        countryId: 'france',
        tagline: 'The Eiffel Tower, Louvre Art & Seine River',
        destinationId: 'paris-france',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'riviera-region',
        name: 'French Riviera (Nice & Cannes)',
        countryId: 'france',
        tagline: 'Azure Mediterranean Coastline & Luxury Resorts',
        destinationId: 'nice-france',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    states: [
      {
        id: 'kyoto-region',
        name: 'Kyoto (Kansai)',
        countryId: 'japan',
        tagline: 'Bamboo Groves, Torii Shrines & Geisha Quarters',
        destinationId: 'kyoto-japan',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'tokyo-region',
        name: 'Tokyo (Kanto)',
        countryId: 'japan',
        tagline: 'Futuristic Skyscrapers, Shibuya & Ancient Temples',
        destinationId: 'tokyo-japan',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    states: [
      {
        id: 'amalfi-region',
        name: 'Amalfi Coast (Campania)',
        countryId: 'italy',
        tagline: 'Cliffside Positano Villages & Limoncello Groves',
        destinationId: 'amalfi-italy',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'tuscany-region',
        name: 'Tuscany (Florence)',
        countryId: 'italy',
        tagline: 'Rolling Wine Hills & Renaissance Masterpieces',
        destinationId: 'florence-italy',
        imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  },
  {
    id: 'greece',
    name: 'Greece',
    flag: '🇬🇷',
    states: [
      {
        id: 'santorini-region',
        name: 'Santorini (Cyclades)',
        countryId: 'greece',
        tagline: 'White-washed Oia Villas & Volcanic Sunsets',
        destinationId: 'santorini-greece',
        imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    flag: '🇨🇭',
    states: [
      {
        id: 'zermatt-region',
        name: 'Zermatt (Valais)',
        countryId: 'switzerland',
        tagline: 'The Matterhorn Peak & Alpine Chalet Skiing',
        destinationId: 'swiss-alps',
        imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
      }
    ]
  }
];
