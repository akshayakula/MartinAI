const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('langchain/prompts');
const { StructuredOutputParser } = require('langchain/output_parsers');
const Vessel = require('../models/Vessel');
const Anomaly = require('../models/Anomaly');
const Geofence = require('../models/Geofence');

// Initialize the model
const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.1,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Define the system prompt
const systemPrompt = `
You are MartinAI, an expert maritime threat detection system.
You analyze vessel data, detect anomalies, and can send alerts to authorities.
Always respond with clear, concise information in a professional tone.

You have access to the following features:
1. View vessel information
2. List recent anomalies
3. Query vessels in specific regions
4. Check if vessels have gone dark (AIS shutoff)

When responding to queries about vessels or anomalies, format data in a clear, structured way.
`;

/**
 * Execute an AI agent query and get a response
 * @param {string} query - User query
 * @returns {Promise<Object>} - Agent response and actions
 */
async function executeQuery(query) {
  try {
    const promptTemplate = new PromptTemplate({
      template: "{system}\n\nUser Query: {query}\n\nContext: {context}\n\nResponse:",
      inputVariables: ["system", "query", "context"],
    });

    // Generate context based on query
    const context = await generateContext(query);

    const formattedPrompt = await promptTemplate.format({
      system: systemPrompt,
      query,
      context,
    });

    // Get response from model
    const response = await model.call(formattedPrompt);

    return {
      response: response.content,
      actions: [], // No actions since we removed Twilio
    };
  } catch (error) {
    console.error('Error in AI agent:', error);
    return {
      response: "I apologize, but I encountered an error processing your request. Please try again later.",
      actions: [],
      error: error.message,
    };
  }
}

/**
 * Generate context information based on user query
 * @param {string} query - User query
 * @returns {Promise<string>} - Context information
 */
async function generateContext(query) {
  let context = '';

  // If query asks about vessels
  if (query.toLowerCase().includes('vessel') || query.toLowerCase().includes('ship')) {
    const vessels = await Vessel.find().limit(5).sort({ lastSeen: -1 });
    context += `Recent vessel data:\n${JSON.stringify(vessels.map(v => ({
      mmsi: v.mmsi,
      name: v.name,
      lat: v.lat,
      lon: v.lon,
      lastSeen: v.lastSeen,
    })), null, 2)}\n\n`;
  }

  // If query asks about anomalies
  if (query.toLowerCase().includes('anomal') || query.toLowerCase().includes('alert')) {
    const anomalies = await Anomaly.find().limit(5).sort({ timestamp: -1 });
    context += `Recent anomalies:\n${JSON.stringify(anomalies.map(a => ({
      id: a._id,
      type: a.anomalyType,
      vessel: a.vesselName || a.mmsi,
      timestamp: a.timestamp,
      confirmed: a.confirmed,
    })), null, 2)}\n\n`;
  }

  // If query asks about geofences
  if (query.toLowerCase().includes('geofence') || query.toLowerCase().includes('zone')) {
    const geofences = await Geofence.find();
    context += `Geofences:\n${JSON.stringify(geofences.map(g => ({
      id: g._id,
      name: g.name,
      active: g.active,
    })), null, 2)}\n\n`;
  }

  // If query is about AIS shutoff
  if (query.toLowerCase().includes('ais') || query.toLowerCase().includes('dark') || query.toLowerCase().includes('shutoff')) {
    const aisAnomalies = await Anomaly.find({ anomalyType: 'AIS_SHUTOFF' }).sort({ timestamp: -1 }).limit(5);
    context += `Recent AIS shutoff events:\n${JSON.stringify(aisAnomalies.map(a => ({
      vessel: a.vesselName || a.mmsi,
      timestamp: a.timestamp,
      location: a.location,
      confirmed: a.confirmed,
    })), null, 2)}\n\n`;
  }

  return context;
}

module.exports = {
  executeQuery,
}; 