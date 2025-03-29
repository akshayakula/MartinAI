const express = require('express');
const router = express.Router();
const Geofence = require('../models/Geofence');

/**
 * GET /api/geofence
 * Get all geofences
 */
router.get('/', async (req, res) => {
  try {
    const geofences = await Geofence.find();
    res.json(geofences);
  } catch (error) {
    console.error('Error getting geofences:', error);
    res.status(500).json({ message: 'Error getting geofences', error: error.message });
  }
});

/**
 * GET /api/geofence/:id
 * Get a specific geofence by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const geofence = await Geofence.findById(req.params.id);
    
    if (!geofence) {
      return res.status(404).json({ message: 'Geofence not found' });
    }
    
    res.json(geofence);
  } catch (error) {
    console.error('Error getting geofence:', error);
    res.status(500).json({ message: 'Error getting geofence', error: error.message });
  }
});

/**
 * POST /api/geofence
 * Create a new geofence
 */
router.post('/', async (req, res) => {
  try {
    const { name, geoJson } = req.body;
    
    if (!name || !geoJson) {
      return res.status(400).json({ message: 'Name and geoJson are required' });
    }
    
    const newGeofence = new Geofence({
      name,
      geoJson,
    });
    
    await newGeofence.save();
    res.status(201).json(newGeofence);
  } catch (error) {
    console.error('Error creating geofence:', error);
    res.status(500).json({ message: 'Error creating geofence', error: error.message });
  }
});

/**
 * PUT /api/geofence/:id
 * Update a geofence
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, geoJson, active } = req.body;
    const geofence = await Geofence.findById(req.params.id);
    
    if (!geofence) {
      return res.status(404).json({ message: 'Geofence not found' });
    }
    
    if (name) geofence.name = name;
    if (geoJson) geofence.geoJson = geoJson;
    if (active !== undefined) geofence.active = active;
    
    geofence.updatedAt = Date.now();
    
    await geofence.save();
    res.json(geofence);
  } catch (error) {
    console.error('Error updating geofence:', error);
    res.status(500).json({ message: 'Error updating geofence', error: error.message });
  }
});

/**
 * DELETE /api/geofence/:id
 * Delete a geofence
 */
router.delete('/:id', async (req, res) => {
  try {
    const geofence = await Geofence.findById(req.params.id);
    
    if (!geofence) {
      return res.status(404).json({ message: 'Geofence not found' });
    }
    
    await Geofence.deleteOne({ _id: req.params.id });
    res.json({ message: 'Geofence deleted successfully' });
  } catch (error) {
    console.error('Error deleting geofence:', error);
    res.status(500).json({ message: 'Error deleting geofence', error: error.message });
  }
});

module.exports = router; 