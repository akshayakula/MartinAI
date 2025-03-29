import React from 'react';
import GeofenceMap from '../map/GeofenceMap';

const MapPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Geofence Monitoring</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4 text-gray-700">
          Draw, edit, and manage geofences to monitor vessel movements. Use the drawing tools to create new geofence areas.
        </p>
        <GeofenceMap />
      </div>
    </div>
  );
};

export default MapPage; 