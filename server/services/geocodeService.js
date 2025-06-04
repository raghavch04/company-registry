import axios from 'axios';
import { RateLimiter } from 'limiter';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

// Configure rate limiter (1 request per second)
const limiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 1000
});

// Configure cache (5 minute TTL)
const cache = new NodeCache({ stdTTL: 300 });

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'CompanyRegistryApp/1.0 (contact@yourdomain.com)';

class GeocodeService {
  constructor() {
    this.localFallbackData = [
      {
        display: 'New Delhi, India',
        lat: 28.6139,
        lng: 77.2090,
        address: {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India'
        }
      },
      {
        display: 'Delhi, India',
        lat: 28.7041,
        lng: 77.1025,
        address: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        }
      }
    ];
  }

  async forwardGeocode(query) {
    const cacheKey = `forward:${query}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Apply rate limiting
      await limiter.removeTokens(1);

      const response = await axios.get(`${NOMINATIM_URL}/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5
        },
        headers: { 'User-Agent': USER_AGENT }
      });

      const results = response.data.map(item => ({
        display: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.address
      }));

      // Cache results
      cache.set(cacheKey, results);
      return results;

    } catch (error) {
      console.error('Forward geocoding error:', error.message);
      // Return local fallback data with the query included
      return this.localFallbackData.map(item => ({
        ...item,
        display: `${query}, ${item.display}`
      }));
    }
  }

  async reverseGeocode(lat, lng) {
    const cacheKey = `reverse:${lat},${lng}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Apply rate limiting
      await limiter.removeTokens(1);

      const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
          addressdetails: 1
        },
        headers: { 'User-Agent': USER_AGENT }
      });

      const result = {
        display: response.data.display_name,
        lat: parseFloat(response.data.lat),
        lng: parseFloat(response.data.lon),
        address: response.data.address
      };

      // Cache result
      cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Reverse geocoding error:', error.message);
      // Find nearest fallback location
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

export const geocodeService = new GeocodeService();