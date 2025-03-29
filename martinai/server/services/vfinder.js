const fetch = require('node-fetch');
const Vessel = require('../models/Vessel');

const apiKey = process.env.VESSELFINDER_API_KEY;

/**
 * Fetch vessels from VesselFinder API within a bounding box
 * @param {string} bbox - Bounding box in format "lat1,lon1,lat2,lon2"
 * @returns {Promise<Array>} - Array of vessel data
 */
async function getVessels(bbox) {
  if (!apiKey) {
    throw new Error('VesselFinder API key is not defined');
  }

  try {
    const url = `https://api.vesselfinder.com/vessels?userkey=${apiKey}&bbox=${bbox}&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vessel data:', error);
    throw error;
  }
}

/**
 * Store vessel data in database and update existing records
 * @param {Array} vessels - Array of vessel data from API
 * @returns {Promise<Array>} - Array of updated/created vessel records
 */
async function storeVesselData(vessels) {
  try {
    const updatedVessels = [];

    for (const vessel of vessels) {
      // Skip if missing required data
      if (!vessel.mmsi || !vessel.lat || !vessel.lon) {
        continue;
      }

      // Find existing vessel or create new one
      const existingVessel = await Vessel.findOne({ mmsi: vessel.mmsi });

      if (existingVessel) {
        // Update existing vessel
        existingVessel.lat = vessel.lat;
        existingVessel.lon = vessel.lon;
        existingVessel.course = vessel.course;
        existingVessel.speed = vessel.speed;
        existingVessel.destination = vessel.destination;
        existingVessel.eta = vessel.eta;
        existingVessel.lastSeen = new Date();
        
        // Add to history
        existingVessel.history.push({
          lat: vessel.lat,
          lon: vessel.lon,
          timestamp: new Date()
        });
        
        // Limit history to last 100 positions
        if (existingVessel.history.length > 100) {
          existingVessel.history = existingVessel.history.slice(-100);
        }
        
        await existingVessel.save();
        updatedVessels.push(existingVessel);
      } else {
        // Create new vessel
        const newVessel = new Vessel({
          mmsi: vessel.mmsi,
          name: vessel.name,
          lat: vessel.lat,
          lon: vessel.lon,
          course: vessel.course,
          speed: vessel.speed,
          destination: vessel.destination,
          eta: vessel.eta,
          history: [
            {
              lat: vessel.lat,
              lon: vessel.lon,
              timestamp: new Date()
            }
          ]
        });
        
        await newVessel.save();
        updatedVessels.push(newVessel);
      }
    }

    return updatedVessels;
  } catch (error) {
    console.error('Error storing vessel data:', error);
    throw error;
  }
}

module.exports = {
  getVessels,
  storeVesselData
}; 