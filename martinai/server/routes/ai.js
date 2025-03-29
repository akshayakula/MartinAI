const express = require('express');
const router = express.Router();
const aiAgent = require('../ai/agent');

/**
 * POST /api/ai/query
 * Query the AI agent
 */
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    const response = await aiAgent.executeQuery(query);
    res.json(response);
  } catch (error) {
    console.error('Error querying AI agent:', error);
    res.status(500).json({ 
      message: 'Error querying AI agent', 
      error: error.message,
      response: "I'm sorry, but I encountered an error processing your request. Please try again later."
    });
  }
});

module.exports = router; 