const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const geofenceRoutes = require('./routes/geofence');
const vesselRoutes = require('./routes/vessels');
const anomalyRoutes = require('./routes/anomalies');
const aiRoutes = require('./routes/ai');

// Routes
app.use('/api/geofence', geofenceRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app; 