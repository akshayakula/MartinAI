const datalasticService = require('../../services/datalastic');
const fetch = require('node-fetch');

// Mock the fetch function
jest.mock('node-fetch');

describe('Datalastic Service', () => {
  // Save original environment variable and restore after tests
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
    // Set up a mock API key for testing
    process.env.DATALASTIC_API_KEY = 'test-api-key';
  });
  
  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });
  
  describe('getVessels', () => {
    it('should fetch vessels within a bounding box', async () => {
      // Arrange - create mock response from Datalastic API
      const mockApiResponse = {
        status: 'ok',
        data: [
          {
            mmsi: '123456789',
            shipname: 'Test Vessel',
            lat: 5.123,
            lon: -0.456,
            course: 180,
            speed: 12.5,
            destination: 'Test Port',
            eta: '2023-04-15T12:00:00Z',
            imo: 'IMO12345',
            callsign: 'ABC123',
            ship_type: 'Cargo',
            draft: '5.2m',
            type_name: 'General Cargo',
            timestamp_utc: '2023-04-10T08:30:00Z',
            navigational_status: 'Under way using engine'
          }
        ]
      };
      
      // Mock the fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });
      
      // Act - call the service method
      const result = await datalasticService.getVessels('5.1,-0.5,5.2,-0.4');
      
      // Assert - check the results
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.datalastic.com/api/v0/vessel_pro')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api-key=test-api-key')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('param=area')
      );
      expect(result).toHaveLength(1);
      expect(result[0].mmsi).toBe('123456789');
      expect(result[0].name).toBe('Test Vessel');
    });
    
    it('should throw an error if API key is not defined', async () => {
      // Arrange - remove API key
      delete process.env.DATALASTIC_API_KEY;
      
      // Act & Assert - expect error to be thrown
      await expect(datalasticService.getVessels('5.1,-0.5,5.2,-0.4'))
        .rejects
        .toThrow('Datalastic API key is not defined');
    });
    
    it('should throw an error if API returns non-ok status', async () => {
      // Arrange - create error response
      const mockErrorResponse = {
        status: 'error',
        message: 'API Error'
      };
      
      // Mock the fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse
      });
      
      // Act & Assert - expect error to be thrown
      await expect(datalasticService.getVessels('5.1,-0.5,5.2,-0.4'))
        .rejects
        .toThrow('Datalastic API error: API Error');
    });
    
    it('should handle fetch errors properly', async () => {
      // Arrange - mock fetch to throw error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Act & Assert - expect error to be propagated
      await expect(datalasticService.getVessels('5.1,-0.5,5.2,-0.4'))
        .rejects
        .toThrow('Network error');
    });
  });
  
  describe('transformDatalasticData', () => {
    it('should transform Datalastic data to application format', () => {
      // This test uses the private function, which we can access through module internals
      // You might need to export this function to test it properly
      
      // You can add this test after modifying the service to export the transform function
    });
    
    it('should handle empty data array', () => {
      // Similarly, test the transform function with empty data
    });
  });
}); 