import React, { useState, useEffect } from 'react';
import { vesselAPI } from '../utils/api';

const VesselList = () => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVessel, setSelectedVessel] = useState(null);

  useEffect(() => {
    loadVessels();
  }, [currentPage]);

  const loadVessels = async () => {
    try {
      setLoading(true);
      const response = await vesselAPI.getAll(currentPage, 10);
      setVessels(response.data.vessels);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vessels:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // If search is empty, just reload the vessels
    if (!searchTerm.trim()) {
      loadVessels();
      return;
    }

    // Client-side filtering for MMSI or name
    // In a production app, this would be a server-side search
    const filteredVessels = vessels.filter(vessel => 
      vessel.mmsi.includes(searchTerm) || 
      (vessel.name && vessel.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setVessels(filteredVessels);
  };

  const handleVesselClick = async (vessel) => {
    try {
      // Get detailed vessel information including history
      const history = await vesselAPI.getHistory(vessel.mmsi);
      setSelectedVessel({
        ...vessel,
        history: history.data
      });
    } catch (error) {
      console.error('Error loading vessel history:', error);
      setSelectedVessel(vessel);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vessel Tracking</h2>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by MMSI or name..."
            className="flex-1 p-2 border rounded-l"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r"
          >
            Search
          </button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vessel List */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="text-center p-4">Loading vessels...</div>
          ) : (
            <>
              {vessels.length === 0 ? (
                <div className="text-center p-4 border rounded bg-gray-50">
                  No vessels found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left border-b">MMSI</th>
                        <th className="p-3 text-left border-b">Name</th>
                        <th className="p-3 text-left border-b">Position</th>
                        <th className="p-3 text-left border-b">Speed</th>
                        <th className="p-3 text-left border-b">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vessels.map(vessel => (
                        <tr 
                          key={vessel.mmsi} 
                          className={`hover:bg-gray-50 cursor-pointer ${selectedVessel?.mmsi === vessel.mmsi ? 'bg-blue-50' : ''}`}
                          onClick={() => handleVesselClick(vessel)}
                        >
                          <td className="p-3 border-b">{vessel.mmsi}</td>
                          <td className="p-3 border-b">{vessel.name || 'Unknown'}</td>
                          <td className="p-3 border-b">
                            Lat: {vessel.lat.toFixed(4)}, Lon: {vessel.lon.toFixed(4)}
                          </td>
                          <td className="p-3 border-b">
                            {vessel.speed ? `${vessel.speed} knots` : 'N/A'}
                          </td>
                          <td className="p-3 border-b">{formatDate(vessel.lastSeen)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Vessel Details */}
        <div className="md:col-span-1">
          {selectedVessel ? (
            <div className="border rounded p-4 bg-white">
              <h3 className="text-xl font-bold mb-4">
                {selectedVessel.name || 'Unknown Vessel'}
              </h3>
              <div className="space-y-2">
                <p><strong>MMSI:</strong> {selectedVessel.mmsi}</p>
                <p><strong>Position:</strong> Lat: {selectedVessel.lat.toFixed(4)}, Lon: {selectedVessel.lon.toFixed(4)}</p>
                <p><strong>Speed:</strong> {selectedVessel.speed ? `${selectedVessel.speed} knots` : 'N/A'}</p>
                <p><strong>Course:</strong> {selectedVessel.course ? `${selectedVessel.course}°` : 'N/A'}</p>
                {selectedVessel.destination && (
                  <p><strong>Destination:</strong> {selectedVessel.destination}</p>
                )}
                <p><strong>Last Seen:</strong> {formatDate(selectedVessel.lastSeen)}</p>
                
                {/* Vessel History */}
                {selectedVessel.history && selectedVessel.history.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold">Position History</h4>
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {selectedVessel.history.map((point, index) => (
                        <div key={index} className="text-sm py-1 border-b">
                          {formatDate(point.timestamp)}: Lat: {point.lat.toFixed(4)}, Lon: {point.lon.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded p-4 bg-gray-50 text-center">
              Select a vessel to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VesselList; 