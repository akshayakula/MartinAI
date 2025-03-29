const mongoose = require('mongoose');

const AnomalySchema = new mongoose.Schema({
  mmsi: {
    type: String,
    required: true
  },
  vesselName: {
    type: String,
    trim: true
  },
  anomalyType: {
    type: String,
    enum: ['AIS_SHUTOFF', 'ROUTE_DEVIATION', 'SPEED_ANOMALY', 'GEOFENCE_VIOLATION'],
    required: true
  },
  location: {
    type: {
      lat: Number,
      lon: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Object
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  resolved: {
    type: Boolean,
    default: false
  },
  feedback: {
    accurate: {
      type: Boolean
    },
    notes: {
      type: String,
      trim: true
    }
  }
});

module.exports = mongoose.model('Anomaly', AnomalySchema); 