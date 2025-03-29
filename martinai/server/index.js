const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dataPoller = require('./services/dataPoller');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

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

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/martinai')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start data polling service after DB connection
    dataPoller.startPolling();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 