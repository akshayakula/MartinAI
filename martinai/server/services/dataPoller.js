const vfinderService = require('./vfinder');
const anomalyService = require('./anomaly');
const Geofence = require('../models/Geofence');

let pollingInterval = null;
const POLL_INTERVAL = 30 * 1000; // 30 seconds

/**
 * Start the data polling service
 */
function startPolling() {
  if (pollingInterval) {
    console.log('Data polling already running');
    return;
  }

  console.log('Starting vessel data polling service');

  // Initial poll
  pollData();

  // Set up interval for regular polling
  pollingInterval = setInterval(pollData, POLL_INTERVAL);
}

/**
 * Stop the data polling service
 */
function stopPolling() {
  if (!pollingInterval) {
    console.log('Data polling not running');
    return;
  }

  console.log('Stopping vessel data polling service');
  clearInterval(pollingInterval);
  pollingInterval = null;
}

/**
 * Poll vessel data from VesselFinder API
 */
async function pollData() {
  try {
    console.log(`Polling vessel data at ${new Date().toISOString()}`);

    // Get all active geofences
    const geofences = await Geofence.find({ active: true });
    
    if (geofences.length === 0) {
      console.log('No active geofences found');
      return;
    }

    // For each geofence, fetch vessel data within its bounding box
    for (const geofence of geofences) {
      try {
        // Calculate bounding box from geofence
        const bbox = calculateBoundingBox(geofence.geoJson);
        
        // Fetch vessel data from API
        const apiVessels = await vfinderService.getVessels(bbox);
        
        // Store vessel data
        const vessels = await vfinderService.storeVesselData(apiVessels);
        
        // Process vessel data for anomalies
        const anomalies = await anomalyService.processVesselData(vessels);
        
        if (anomalies.length > 0) {
          console.log(`Detected ${anomalies.length} anomalies in geofence ${geofence.name}`);
        }
      } catch (error) {
        console.error(`Error polling data for geofence ${geofence.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in data polling:', error);
  }
}

/**
 * Calculate bounding box from GeoJSON polygon
 * @param {Object} geoJson - GeoJSON polygon
 * @returns {string} - Bounding box in format "lat1,lon1,lat2,lon2"
 */
function calculateBoundingBox(geoJson) {
  try {
    const coordinates = geoJson.coordinates[0]; // Assuming the first polygon
    
    // Initialize min/max values
    let minLat = 90;
    let maxLat = -90;
    let minLon = 180;
    let maxLon = -180;
    
    // Find min/max values from coordinates
    for (const coord of coordinates) {
      const lon = coord[0];
      const lat = coord[1];
      
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
    }
    
    // Add some padding
    minLat -= 0.1;
    maxLat += 0.1;
    minLon -= 0.1;
    maxLon += 0.1;
    
    return `${minLat},${minLon},${maxLat},${maxLon}`;
  } catch (error) {
    console.error('Error calculating bounding box:', error);
    throw error;
  }
}

module.exports = {
  startPolling,
  stopPolling,
  pollData
}; 