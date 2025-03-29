const turf = require('@turf/turf');
const Vessel = require('../models/Vessel');
const Geofence = require('../models/Geofence');
const Anomaly = require('../models/Anomaly');

// Cache to track vessel presence
let vesselCache = {};

/**
 * Detect AIS shutoff anomalies
 * @returns {Promise<Array>} - Array of detected anomalies
 */
async function detectAisShutoff() {
  try {
    const anomalies = [];
    const now = Date.now();
    const cutoffTime = now - (30 * 60 * 1000); // 30 minutes ago

    // Get all vessels seen recently but not in the last poll
    const recentlySeenVessels = await Vessel.find({
      lastSeen: { $lt: cutoffTime, $gt: new Date(now - 24 * 60 * 60 * 1000) }
    });

    for (const vessel of recentlySeenVessels) {
      // Check if vessel was recently active but now not reporting
      if (vessel.lastSeen < new Date(cutoffTime)) {
        // Create an anomaly record
        const anomaly = new Anomaly({
          mmsi: vessel.mmsi,
          vesselName: vessel.name,
          anomalyType: 'AIS_SHUTOFF',
          location: {
            lat: vessel.lat,
            lon: vessel.lon
          },
          details: {
            lastSeen: vessel.lastSeen,
            lastPosition: {
              lat: vessel.lat,
              lon: vessel.lon
            }
          }
        });

        await anomaly.save();
        anomalies.push(anomaly);
      }
    }

    return anomalies;
  } catch (error) {
    console.error('Error detecting AIS shutoff:', error);
    throw error;
  }
}

/**
 * Detect route deviation anomalies
 * @param {Object} vessel - Vessel object
 * @param {Array} vesselHistory - Array of historical positions
 * @returns {Promise<Object|null>} - Detected anomaly or null
 */
async function detectRouteDeviation(vessel, vesselHistory) {
  try {
    // Need at least 3 points to determine a route
    if (vesselHistory.length < 3) {
      return null;
    }

    // Create a line string from historical points
    const points = vesselHistory.map(point => [point.lon, point.lat]);
    const route = turf.lineString(points);
    
    // Get the last point (current position)
    const currentPoint = turf.point([vessel.lon, vessel.lat]);
    
    // Calculate distance from the expected route
    const deviationDistance = turf.pointToLineDistance(currentPoint, route, { units: 'nauticalmiles' });
    
    // If deviation is more than 5 nautical miles, it's an anomaly
    if (deviationDistance > 5) {
      const anomaly = new Anomaly({
        mmsi: vessel.mmsi,
        vesselName: vessel.name,
        anomalyType: 'ROUTE_DEVIATION',
        location: {
          lat: vessel.lat,
          lon: vessel.lon
        },
        details: {
          deviationDistance,
          expectedRoute: route,
          currentPoint: [vessel.lon, vessel.lat]
        }
      });

      await anomaly.save();
      return anomaly;
    }

    return null;
  } catch (error) {
    console.error('Error detecting route deviation:', error);
    throw error;
  }
}

/**
 * Detect geofence violations
 * @param {Object} vessel - Vessel object
 * @returns {Promise<Object|null>} - Detected anomaly or null
 */
async function detectGeofenceViolation(vessel) {
  try {
    // Get all active geofences
    const geofences = await Geofence.find({ active: true });
    
    for (const geofence of geofences) {
      const point = turf.point([vessel.lon, vessel.lat]);
      const polygon = turf.polygon(geofence.geoJson.coordinates);
      
      // Check if point is inside polygon
      const isInside = turf.booleanPointInPolygon(point, polygon);
      
      if (isInside) {
        const anomaly = new Anomaly({
          mmsi: vessel.mmsi,
          vesselName: vessel.name,
          anomalyType: 'GEOFENCE_VIOLATION',
          location: {
            lat: vessel.lat,
            lon: vessel.lon
          },
          details: {
            geofenceId: geofence._id,
            geofenceName: geofence.name
          }
        });

        await anomaly.save();
        return anomaly;
      }
    }

    return null;
  } catch (error) {
    console.error('Error detecting geofence violation:', error);
    throw error;
  }
}

/**
 * Process vessel data and detect all anomalies
 * @param {Array} vessels - Array of vessel objects
 * @returns {Promise<Array>} - Array of detected anomalies
 */
async function processVesselData(vessels) {
  const anomalies = [];

  for (const vessel of vessels) {
    // Get vessel history
    const vesselData = await Vessel.findOne({ mmsi: vessel.mmsi });
    
    if (vesselData) {
      // Check for route deviation
      const routeDeviation = await detectRouteDeviation(vessel, vesselData.history);
      if (routeDeviation) {
        anomalies.push(routeDeviation);
      }
      
      // Check for geofence violation
      const geofenceViolation = await detectGeofenceViolation(vessel);
      if (geofenceViolation) {
        anomalies.push(geofenceViolation);
      }
    }
  }

  // Check for AIS shutoff
  const aisShutoffs = await detectAisShutoff();
  anomalies.push(...aisShutoffs);

  return anomalies;
}

module.exports = {
  detectAisShutoff,
  detectRouteDeviation,
  detectGeofenceViolation,
  processVesselData
}; 