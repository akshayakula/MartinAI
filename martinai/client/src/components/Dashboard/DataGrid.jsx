import React from 'react';
import { DataCard } from './DataCard';

export const DataGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DataCard 
        title="Active Vessels" 
        value={data.activeVessels || 0}
        icon="🚢" 
        colorStyle="border-debugger-blue"
        trend={{
          value: 2,
          direction: 'up',
          text: 'from yesterday'
        }}
      />
      
      <DataCard 
        title="AIS Shutoffs" 
        value={data.aisShutoffs || 0}
        icon="📡" 
        colorStyle="border-danger"
        trend={{
          value: 1,
          direction: 'up',
          text: 'in last hour'
        }}
      />
      
      <DataCard 
        title="Route Deviations" 
        value={data.routeDeviations || 0}
        icon="🛑" 
        colorStyle="border-warning"
        trend={{
          value: 3,
          direction: 'down',
          text: 'from yesterday'
        }}
      />
      
      <DataCard 
        title="Active Geofences" 
        value={data.geofences || 0}
        icon="🔍" 
        colorStyle="border-success"
        trend={{
          value: 0,
          direction: 'neutral',
          text: 'unchanged'
        }}
      />
    </div>
  );
}; 