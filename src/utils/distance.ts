// Haversine formula for distance and travel time calculation between coordinates

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateTravelTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { text: string; mode: 'walk' | 'drive' | 'transit' } {
  const distKm = calculateDistanceKm(lat1, lon1, lat2, lon2);

  if (distKm <= 0.05) {
    return { text: '📍 Nearby (1 min walk)', mode: 'walk' };
  }

  if (distKm < 1.2) {
    const meters = Math.round(distKm * 1000);
    const mins = Math.max(2, Math.round(meters / 80)); // ~80m/min walking
    return { text: `🚶 ${mins} mins (${meters} m walk)`, mode: 'walk' };
  }

  if (distKm < 50) {
    const mins = Math.max(5, Math.round((distKm / 35) * 60)); // ~35km/h city driving
    return { text: `🚗 ${mins} mins (${distKm.toFixed(1)} km drive)`, mode: 'drive' };
  }

  const hours = (distKm / 65).toFixed(1); // ~65km/h transit
  return { text: `🚗 ${hours} hrs (${distKm.toFixed(0)} km drive)`, mode: 'transit' };
}
