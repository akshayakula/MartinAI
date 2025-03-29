const dataPoller = require('../../services/dataPoller');
const datalasticService = require('../../services/datalastic');
const anomalyService = require('../../services/anomaly');
const Geofence = require('../../models/Geofence');

// Mock all dependencies
jest.mock('../../services/datalastic');
jest.mock('../../services/anomaly');
jest.mock('../../models/Geofence');

describe('Data Poller Service', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
    
    // Clear any intervals that might have been set
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Stop polling if it was started
    dataPoller.stopPolling();
    
    // Restore timers
    jest.useRealTimers();
  });
  
  describe('pollData', () => {
    it('should poll vessel data from Datalastic for active geofences', async () => {
      // Arrange - setup mock data
      const mockGeofences = [
        {
          _id: '1',
          name: 'Test Geofence',
          active: true,
          geoJson: {
            coordinates: [
              [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0]
              ]
            ]
          }
        }
      ];
      
      const mockVessels = [
        { mmsi: '123456789', name: 'Test Vessel', lat: 0.5, lon: 0.5 }
      ];
      
      const mockAnomalies = [
        { _id: '1', vesselName: 'Test Vessel', anomalyType: 'GEOFENCE_VIOLATION' }
      ];
      
      // Mock the dependencies
      Geofence.find.mockResolvedValueOnce(mockGeofences);
      datalasticService.getVessels.mockResolvedValueOnce(mockVessels);
      datalasticService.storeVesselData.mockResolvedValueOnce(mockVessels);
      anomalyService.processVesselData.mockResolvedValueOnce(mockAnomalies);
      
      // Act - call the pollData method
      await dataPoller.pollData();
      
      // Assert - check that the correct methods were called
      expect(Geofence.find).toHaveBeenCalledWith({ active: true });
      expect(datalasticService.getVessels).toHaveBeenCalledWith(
        expect.stringMatching(/^-0.1,-0.1,1.1,1.1$/)
      );
      expect(datalasticService.storeVesselData).toHaveBeenCalledWith(mockVessels);
      expect(anomalyService.processVesselData).toHaveBeenCalledWith(mockVessels);
    });
    
    it('should handle errors when polling data for a geofence', async () => {
      // Arrange - setup mock data with error
      const mockGeofences = [
        {
          _id: '1',
          name: 'Test Geofence',
          active: true,
          geoJson: {
            coordinates: [
              [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0]
              ]
            ]
          }
        }
      ];
      
      // Mock the dependencies
      Geofence.find.mockResolvedValueOnce(mockGeofences);
      datalasticService.getVessels.mockRejectedValueOnce(new Error('API error'));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act - call the pollData method
      await dataPoller.pollData();
      
      // Assert - check that error was handled
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error polling data for geofence Test Geofence'),
        expect.any(Error)
      );
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    it('should do nothing if no active geofences are found', async () => {
      // Arrange - mock empty geofences
      Geofence.find.mockResolvedValueOnce([]);
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Act - call the pollData method
      await dataPoller.pollData();
      
      // Assert - check logs and that no other methods were called
      expect(consoleLogSpy).toHaveBeenCalledWith('No active geofences found');
      expect(datalasticService.getVessels).not.toHaveBeenCalled();
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });
  
  describe('startPolling and stopPolling', () => {
    it('should start and stop polling as expected', () => {
      // Spy on pollData
      const pollDataSpy = jest.spyOn(dataPoller, 'pollData').mockImplementation(() => Promise.resolve());
      
      // Act - start polling
      dataPoller.startPolling();
      
      // Assert - check initial poll
      expect(pollDataSpy).toHaveBeenCalledTimes(1);
      
      // Act - advance time to trigger interval
      jest.advanceTimersByTime(30000); // 30 seconds
      
      // Assert - check poll called again
      expect(pollDataSpy).toHaveBeenCalledTimes(2);
      
      // Act - stop polling
      dataPoller.stopPolling();
      
      // Advance time again
      jest.advanceTimersByTime(30000);
      
      // Assert - polling stopped, no more calls
      expect(pollDataSpy).toHaveBeenCalledTimes(2);
      
      // Restore spy
      pollDataSpy.mockRestore();
    });
  });
}); 