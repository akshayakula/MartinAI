const fetch = require('node-fetch');
const Vessel = require('../models/Vessel');

const apiKey = process.env.DATALASTIC_API_KEY;

/**
 * Fetch vessels from Datalastic API Pro endpoint within a bounding box
 * @param {string} bbox - Bounding box in format "lat1,lon1,lat2,lon2"
 * @returns {Promise<Array>} - Array of vessel data
 */
async function getVessels(bbox) {
  if (!apiKey) {
    throw new Error('Datalastic API key is not defined');
  }

  try {
    // Parse bbox from "lat1,lon1,lat2,lon2" format
    const [lat1, lon1, lat2, lon2] = bbox.split(',').map(Number);
    
    // Datalastic Pro API endpoint
    const url = `https://api.datalastic.com/api/v0/vessel_pro?api-key=${apiKey}&param=area&value=${lat1},${lon1},${lat2},${lon2}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Error handling for Datalastic API response
    if (data.status !== 'ok') {
      throw new Error(`Datalastic API error: ${data.message || 'Unknown error'}`);
    }
    
    // Transform the Datalastic data structure to match our application's expected format
    return transformDatalasticData(data.data);
  } catch (error) {
    console.error('Error fetching vessel data:', error);
    throw error;
  }
}

/**
 * Transform Datalastic API data to application format
 * @param {Array} datalasticVessels - Array of vessel data from Datalastic API
 * @returns {Array} - Transformed vessel data
 */
function transformDatalasticData(datalasticVessels) {
  if (!Array.isArray(datalasticVessels)) {
    return [];
  }
  
  return datalasticVessels.map(vessel => ({
    mmsi: vessel.mmsi.toString(),
    name: vessel.shipname || 'Unknown',
    lat: vessel.lat,
    lon: vessel.lon,
    course: vessel.course,
    speed: vessel.speed,
    destination: vessel.destination || '',
    eta: vessel.eta || null,
    imo: vessel.imo || '',
    callsign: vessel.callsign || '',
    shipType: vessel.ship_type || '',
    draft: vessel.draft || '',
    vesselType: vessel.type_name || '',
    timestampUtc: vessel.timestamp_utc || new Date().toISOString(),
    atd: vessel.atd || null, // Actual time of departure
    navStatus: vessel.navigational_status || ''
  }));
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
        
        // Update additional fields from Pro API
        if (vessel.imo) existingVessel.imo = vessel.imo;
        if (vessel.callsign) existingVessel.callsign = vessel.callsign;
        if (vessel.shipType) existingVessel.shipType = vessel.shipType;
        if (vessel.draft) existingVessel.draft = vessel.draft;
        if (vessel.vesselType) existingVessel.vesselType = vessel.vesselType;
        if (vessel.navStatus) existingVessel.navStatus = vessel.navStatus;
        
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
          imo: vessel.imo,
          callsign: vessel.callsign,
          shipType: vessel.shipType,
          draft: vessel.draft,
          vesselType: vessel.vesselType,
          navStatus: vessel.navStatus,
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