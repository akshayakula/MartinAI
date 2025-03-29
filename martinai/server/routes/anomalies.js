const express = require('express');
const router = express.Router();
const Anomaly = require('../models/Anomaly');
const anomalyService = require('../services/anomaly');

/**
 * GET /api/anomalies
 * Get all anomalies with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      mmsi, 
      confirmed, 
      resolved,
      startDate,
      endDate
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query filters
    const filters = {};
    if (type) filters.anomalyType = type;
    if (mmsi) filters.mmsi = mmsi;
    if (confirmed !== undefined) filters.confirmed = confirmed === 'true';
    if (resolved !== undefined) filters.resolved = resolved === 'true';
    
    // Date range filter
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }
    
    const anomalies = await Anomaly.find(filters)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Anomaly.countDocuments(filters);
    
    res.json({
      anomalies,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error getting anomalies:', error);
    res.status(500).json({ message: 'Error getting anomalies', error: error.message });
  }
});

/**
 * GET /api/anomalies/:id
 * Get a specific anomaly by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id);
    
    if (!anomaly) {
      return res.status(404).json({ message: 'Anomaly not found' });
    }
    
    res.json(anomaly);
  } catch (error) {
    console.error('Error getting anomaly:', error);
    res.status(500).json({ message: 'Error getting anomaly', error: error.message });
  }
});

/**
 * POST /api/anomalies
 * Create a new anomaly manually
 */
router.post('/', async (req, res) => {
  try {
    const { mmsi, vesselName, anomalyType, location, details } = req.body;
    
    if (!mmsi || !anomalyType) {
      return res.status(400).json({ message: 'MMSI and anomaly type are required' });
    }
    
    const newAnomaly = new Anomaly({
      mmsi,
      vesselName,
      anomalyType,
      location,
      details
    });
    
    await newAnomaly.save();
    res.status(201).json(newAnomaly);
  } catch (error) {
    console.error('Error creating anomaly:', error);
    res.status(500).json({ message: 'Error creating anomaly', error: error.message });
  }
});

/**
 * PUT /api/anomalies/:id
 * Update an anomaly (e.g., confirm or resolve)
 */
router.put('/:id', async (req, res) => {
  try {
    const { confirmed, resolved, feedback } = req.body;
    const anomaly = await Anomaly.findById(req.params.id);
    
    if (!anomaly) {
      return res.status(404).json({ message: 'Anomaly not found' });
    }
    
    if (confirmed !== undefined) anomaly.confirmed = confirmed;
    if (resolved !== undefined) anomaly.resolved = resolved;
    if (feedback) anomaly.feedback = feedback;
    
    await anomaly.save();
    res.json(anomaly);
  } catch (error) {
    console.error('Error updating anomaly:', error);
    res.status(500).json({ message: 'Error updating anomaly', error: error.message });
  }
});

/**
 * DELETE /api/anomalies/:id
 * Delete an anomaly
 */
router.delete('/:id', async (req, res) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id);
    
    if (!anomaly) {
      return res.status(404).json({ message: 'Anomaly not found' });
    }
    
    await Anomaly.deleteOne({ _id: req.params.id });
    res.json({ message: 'Anomaly deleted successfully' });
  } catch (error) {
    console.error('Error deleting anomaly:', error);
    res.status(500).json({ message: 'Error deleting anomaly', error: error.message });
  }
});

module.exports = router; 