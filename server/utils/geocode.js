import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      timeout: 10000, // 10 seconds
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'CompanyFinderApp/1.0 (your@email.com)'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }

    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error.code || error.message);
    throw error;
  }
};
