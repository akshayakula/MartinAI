import React, { useState, useEffect } from 'react';
import { anomalyAPI } from '../utils/api';

const AnomalyList = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    confirmed: '',
    resolved: '',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alertStatus, setAlertStatus] = useState({ show: false, message: '', type: '' });

  // Load anomalies on component mount and when filters/page change
  useEffect(() => {
    loadAnomalies();
  }, [currentPage, filters]);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters,
      };

      // Filter out empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await anomalyAPI.getAll(params);
      setAnomalies(response.data.anomalies);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading anomalies:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleConfirmAnomaly = async (id, confirmed) => {
    try {
      await anomalyAPI.update(id, { confirmed });
      setAnomalies(anomalies.map(a => a._id === id ? { ...a, confirmed } : a));
    } catch (error) {
      console.error('Error updating anomaly:', error);
    }
  };

  const handleResolveAnomaly = async (id, resolved) => {
    try {
      await anomalyAPI.update(id, { resolved });
      setAnomalies(anomalies.map(a => a._id === id ? { ...a, resolved } : a));
    } catch (error) {
      console.error('Error updating anomaly:', error);
    }
  };

  const handleSendAlert = async (id) => {
    try {
      if (!phoneNumber) {
        setAlertStatus({ 
          show: true, 
          message: 'Please enter a phone number', 
          type: 'error' 
        });
        return;
      }

      await anomalyAPI.sendAlert(id, phoneNumber);
      setAlertStatus({ 
        show: true, 
        message: 'Alert sent successfully', 
        type: 'success' 
      });

      // Auto-hide the alert after 3 seconds
      setTimeout(() => {
        setAlertStatus({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending alert:', error);
      setAlertStatus({ 
        show: true, 
        message: `Error sending alert: ${error.message}`, 
        type: 'error' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getAnomalyTypeLabel = (type) => {
    switch (type) {
      case 'AIS_SHUTOFF':
        return 'AIS Shutoff';
      case 'ROUTE_DEVIATION':
        return 'Route Deviation';
      case 'SPEED_ANOMALY':
        return 'Speed Anomaly';
      case 'GEOFENCE_VIOLATION':
        return 'Geofence Violation';
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Anomaly Detection</h2>
      
      {/* Filter controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="AIS_SHUTOFF">AIS Shutoff</option>
            <option value="ROUTE_DEVIATION">Route Deviation</option>
            <option value="SPEED_ANOMALY">Speed Anomaly</option>
            <option value="GEOFENCE_VIOLATION">Geofence Violation</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Confirmed</label>
          <select
            name="confirmed"
            value={filters.confirmed}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="true">Confirmed</option>
            <option value="false">Unconfirmed</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Resolved</label>
          <select
            name="resolved"
            value={filters.resolved}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="true">Resolved</option>
            <option value="false">Unresolved</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">SMS Alert Phone</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      {/* Alert message */}
      {alertStatus.show && (
        <div className={`p-3 mb-4 rounded ${alertStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {alertStatus.message}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <div className="text-center p-4">Loading anomalies...</div>
      ) : (
        <>
          {/* Anomalies table */}
          {anomalies.length === 0 ? (
            <div className="text-center p-4 border rounded bg-gray-50">
              No anomalies found matching the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left border-b">Type</th>
                    <th className="p-3 text-left border-b">Vessel</th>
                    <th className="p-3 text-left border-b">Time</th>
                    <th className="p-3 text-left border-b">Location</th>
                    <th className="p-3 text-left border-b">Status</th>
                    <th className="p-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map(anomaly => (
                    <tr key={anomaly._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">
                        {getAnomalyTypeLabel(anomaly.anomalyType)}
                      </td>
                      <td className="p-3 border-b">
                        {anomaly.vesselName || anomaly.mmsi}
                      </td>
                      <td className="p-3 border-b">
                        {formatDate(anomaly.timestamp)}
                      </td>
                      <td className="p-3 border-b">
                        {anomaly.location && (
                          <>Lat: {anomaly.location.lat.toFixed(4)}, Lon: {anomaly.location.lon.toFixed(4)}</>
                        )}
                      </td>
                      <td className="p-3 border-b">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${anomaly.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {anomaly.confirmed ? 'Confirmed' : 'Unconfirmed'}
                          </span>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${anomaly.resolved ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            {anomaly.resolved ? 'Resolved' : 'Open'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="space-y-2">
                          <div className="space-x-2">
                            <button
                              onClick={() => handleConfirmAnomaly(anomaly._id, !anomaly.confirmed)}
                              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                            >
                              {anomaly.confirmed ? 'Unconfirm' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => handleResolveAnomaly(anomaly._id, !anomaly.resolved)}
                              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                            >
                              {anomaly.resolved ? 'Reopen' : 'Resolve'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleSendAlert(anomaly._id)}
                            disabled={!phoneNumber}
                            className={`w-full px-3 py-1 text-sm rounded ${phoneNumber ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                          >
                            Send Alert
                          </button>
                        </div>
                      </td>
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
  );
};

export default AnomalyList; 