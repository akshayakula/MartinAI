const agent = require('../../ai/agent');
const Vessel = require('../../models/Vessel');
const Anomaly = require('../../models/Anomaly');
const Geofence = require('../../models/Geofence');
const { ChatOpenAI } = require('@langchain/openai');

// Mock dependencies
jest.mock('../../models/Vessel');
jest.mock('../../models/Anomaly');
jest.mock('../../models/Geofence');
jest.mock('@langchain/openai');

describe('AI Agent', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
    
    // Setup mocks for the LLM
    ChatOpenAI.mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({ content: 'AI response' })
    }));
  });
  
  describe('executeQuery', () => {
    it('should execute a query about vessels and return a response', async () => {
      // Arrange - setup mock vessel data
      const mockVessels = [
        {
          mmsi: '123456789',
          name: 'Test Vessel',
          lat: 5.123,
          lon: -0.456,
          lastSeen: new Date()
        }
      ];
      
      // Mock the vessel find method
      Vessel.find.mockReturnValueOnce({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockVessels)
      });
      
      // Act - execute a query about vessels
      const result = await agent.executeQuery('Show me the latest vessels');
      
      // Assert - check the response
      expect(result).toHaveProperty('response', 'AI response');
      expect(Vessel.find).toHaveBeenCalled();
    });
    
    it('should handle errors gracefully', async () => {
      // Arrange - make ChatOpenAI throw error
      ChatOpenAI.mockImplementation(() => ({
        call: jest.fn().mockRejectedValue(new Error('AI error'))
      }));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act - execute a query
      const result = await agent.executeQuery('Test query');
      
      // Assert - check error handling
      expect(result).toHaveProperty('response', expect.stringContaining('I apologize'));
      expect(result).toHaveProperty('error', 'AI error');
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('generateContext', () => {
    it('should generate context for vessel queries', async () => {
      // Arrange - setup mock vessel data
      const mockVessels = [
        {
          mmsi: '123456789',
          name: 'Test Vessel',
          lat: 5.123,
          lon: -0.456,
          lastSeen: new Date()
        }
      ];
      
      // Mock the vessel find method
      Vessel.find.mockReturnValueOnce({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockVessels)
      });
      
      // Act - generate context for a vessel query
      const context = await agent.generateContext('Tell me about vessels');
      
      // Assert - check the context
      expect(context).toContain('Recent vessel data');
      expect(context).toContain('123456789');
      expect(Vessel.find).toHaveBeenCalled();
    });
    
    // Add more tests for anomaly and geofence context generation
  });
}); 