import React, { useState, useEffect } from 'react';
import { anomalyAPI, vesselAPI } from '../utils/api';
import AIChat from '../components/AIChat';

const Dashboard = () => {
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [recentVessels, setRecentVessels] = useState([]);
  const [anomalyStats, setAnomalyStats] = useState({
    total: 0,
    confirmed: 0,
    resolved: 0,
    byType: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent anomalies (limited to 5)
      const anomaliesResponse = await anomalyAPI.getAll({ limit: 5 });
      setRecentAnomalies(anomaliesResponse.data.anomalies);
      
      // Fetch recent vessels (limited to 5)
      const vesselsResponse = await vesselAPI.getAll(1, 5);
      setRecentVessels(vesselsResponse.data.vessels);
      
      // Calculate anomaly statistics
      if (anomaliesResponse.data.total > 0) {
        // Get all anomalies for stats (up to 100)
        const allAnomaliesResponse = await anomalyAPI.getAll({ limit: 100 });
        const allAnomalies = allAnomaliesResponse.data.anomalies;
        
        const confirmed = allAnomalies.filter(a => a.confirmed).length;
        const resolved = allAnomalies.filter(a => a.resolved).length;
        
        // Count by type
        const byType = allAnomalies.reduce((acc, anomaly) => {
          const type = anomaly.anomalyType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        
        setAnomalyStats({
          total: allAnomaliesResponse.data.total,
          confirmed,
          resolved,
          byType
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Maritime Monitoring Dashboard</h1>
      
      {loading ? (
        <div className="text-center p-4">Loading dashboard data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Anomaly Statistics Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Anomaly Statistics</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <span className="block text-2xl font-bold text-blue-700">{anomalyStats.total}</span>
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <span className="block text-2xl font-bold text-green-700">{anomalyStats.confirmed}</span>
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <span className="block text-2xl font-bold text-yellow-700">{anomalyStats.resolved}</span>
                <span className="text-sm text-gray-600">Resolved</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">By Type</h3>
              <div className="space-y-2">
                {Object.entries(anomalyStats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span>{getAnomalyTypeLabel(type)}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Anomalies Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Anomalies</h2>
            {recentAnomalies.length === 0 ? (
              <p className="text-gray-500">No anomalies detected yet.</p>
            ) : (
              <div className="space-y-3">
                {recentAnomalies.map(anomaly => (
                  <div key={anomaly._id} className="p-3 border rounded">
                    <div className="flex justify-between">
                      <span className="font-semibold">{getAnomalyTypeLabel(anomaly.anomalyType)}</span>
                      <span className="text-xs text-gray-500">{formatDate(anomaly.timestamp)}</span>
                    </div>
                    <p className="text-sm">Vessel: {anomaly.vesselName || anomaly.mmsi}</p>
                    <div className="mt-1 flex space-x-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${anomaly.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {anomaly.confirmed ? 'Confirmed' : 'Unconfirmed'}
                      </span>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${anomaly.resolved ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {anomaly.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Vessels Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Vessels</h2>
            {recentVessels.length === 0 ? (
              <p className="text-gray-500">No vessels tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {recentVessels.map(vessel => (
                  <div key={vessel.mmsi} className="p-3 border rounded">
                    <div className="font-semibold">{vessel.name || 'Unknown Vessel'}</div>
                    <p className="text-sm">MMSI: {vessel.mmsi}</p>
                    <p className="text-sm">
                      Lat: {vessel.lat.toFixed(4)}, Lon: {vessel.lon.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last seen: {formatDate(vessel.lastSeen)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* AI Chat */}
          <div className="md:col-span-2 lg:col-span-3">
            <AIChat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 