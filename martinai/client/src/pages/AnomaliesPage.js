import React from 'react';
import AnomalyList from '../components/AnomalyList';

const AnomaliesPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Anomaly Detection</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4 text-gray-700">
          Monitor and manage detected anomalies such as AIS shutoffs, route deviations, and geofence violations.
          Confirm anomalies, send alerts, and track resolution status.
        </p>
        <AnomalyList />
      </div>
    </div>
  );
};

export default AnomaliesPage; 