const app = require('./app');
const dataPoller = require('./services/dataPoller');

const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Start data polling service
  dataPoller.startPolling();
}); 