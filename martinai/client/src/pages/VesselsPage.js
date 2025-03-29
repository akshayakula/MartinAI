import React from 'react';
import VesselList from '../components/VesselList';

const VesselsPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vessel Tracking</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4 text-gray-700">
          Track and monitor vessels in real-time. View detailed information on vessel positions, speed, and history.
        </p>
        <VesselList />
      </div>
    </div>
  );
};

export default VesselsPage; 