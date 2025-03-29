const mongoose = require('mongoose');

const VesselSchema = new mongoose.Schema({
  mmsi: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    trim: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  course: {
    type: Number
  },
  speed: {
    type: Number
  },
  destination: {
    type: String,
    trim: true
  },
  eta: {
    type: Date
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  history: [{
    lat: Number,
    lon: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Vessel', VesselSchema); 