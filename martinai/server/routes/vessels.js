const express = require('express');
const router = express.Router();
const Vessel = require('../models/Vessel');
const vfinderService = require('../services/vfinder');

/**
 * GET /api/vessels
 * Get all vessels with pagination
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const vessels = await Vessel.find()
      .sort({ lastSeen: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Vessel.countDocuments();
    
    res.json({
      vessels,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error getting vessels:', error);
    res.status(500).json({ message: 'Error getting vessels', error: error.message });
  }
});

/**
 * GET /api/vessels/:mmsi
 * Get a specific vessel by MMSI
 */
router.get('/:mmsi', async (req, res) => {
  try {
    const vessel = await Vessel.findOne({ mmsi: req.params.mmsi });
    
    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }
    
    res.json(vessel);
  } catch (error) {
    console.error('Error getting vessel:', error);
    res.status(500).json({ message: 'Error getting vessel', error: error.message });
  }
});

/**
 * GET /api/vessels/bbox/:bbox
 * Get vessels within a bounding box
 */
router.get('/bbox/:bbox', async (req, res) => {
  try {
    const bbox = req.params.bbox; // Format: "lat1,lon1,lat2,lon2"
    
    if (!bbox || !bbox.split(',').every(coord => !isNaN(parseFloat(coord)))) {
      return res.status(400).json({ message: 'Invalid bounding box format' });
    }
    
    // Fetch from VesselFinder API
    const apiVessels = await vfinderService.getVessels(bbox);
    
    // Store vessel data
    const vessels = await vfinderService.storeVesselData(apiVessels);
    
    res.json(vessels);
  } catch (error) {
    console.error('Error getting vessels in bbox:', error);
    res.status(500).json({ message: 'Error getting vessels', error: error.message });
  }
});

/**
 * GET /api/vessels/history/:mmsi
 * Get vessel position history
 */
router.get('/history/:mmsi', async (req, res) => {
  try {
    const vessel = await Vessel.findOne({ mmsi: req.params.mmsi });
    
    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }
    
    res.json(vessel.history);
  } catch (error) {
    console.error('Error getting vessel history:', error);
    res.status(500).json({ message: 'Error getting vessel history', error: error.message });
  }
});

/**
 * DELETE /api/vessels/:mmsi
 * Delete a vessel by MMSI
 */
router.delete('/:mmsi', async (req, res) => {
  try {
    const vessel = await Vessel.findOne({ mmsi: req.params.mmsi });
    
    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }
    
    await Vessel.deleteOne({ mmsi: req.params.mmsi });
    res.json({ message: 'Vessel deleted successfully' });
  } catch (error) {
    console.error('Error deleting vessel:', error);
    res.status(500).json({ message: 'Error deleting vessel', error: error.message });
  }
});

module.exports = router; 