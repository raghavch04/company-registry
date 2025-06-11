import express from 'express';
import { geocodeService } from '../services/geocodeService.js';

const router = express.Router();

router.get('/forward', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        error: 'Valid query parameter "q" is required' 
      });
    }

    const results = await geocodeService.forwardGeocode(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      error: 'Geocoding service unavailable',
      details: error.message
    });
  }
});

router.get('/reverse', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ 
        error: 'Valid numeric "lat" and "lng" parameters are required' 
      });
    }

    const result = await geocodeService.reverseGeocode(lat, lng);
   
    res.json(result);
  } catch (error) { 
    res.status(500).json({ 
      error: 'Reverse geocoding service unavailable',
      details: error.message
    });
  }        
});

export default router;      