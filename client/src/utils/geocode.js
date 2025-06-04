import { api } from './api';

// Client-side cache with 5 minute TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

class GeocodeClient {
  constructor() {
    this.localFallbackData = [
      {
        display: 'New Delhi, India',
        lat: 28.6139,
        lng: 77.2090
      },
      {
        display: 'Delhi, India',
        lat: 28.7041,
        lng: 77.1025
      }
    ];
  }

  async forward(query) {
    const cacheKey = `forward:${query}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await api.get('/geocode/forward', { params: { q: query } });
      
      // Update cache
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Forward geocoding error:', error);
      // Return local fallback with query
      return this.localFallbackData.map(item => ({
        ...item,
        display: `${query}, ${item.display}`
      }));
    }
  }

  async reverse(lat, lng) {
    const cacheKey = `reverse:${lat},${lng}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await api.get('/geocode/reverse', { params: { lat, lng } });
      
      // Update cache
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Find nearest fallback
      const nearestFallback = this.localFallbackData.reduce((prev, curr) => {
        const prevDist = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
        const currDist = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
        return prevDist < currDist ? prev : curr;
      });
      
      return {
        ...nearestFallback,
        lat,
        lng,
        display: `Approximate location near ${nearestFallback.display}`
      };
    }
  }
}

export const geocode = new GeocodeClient();