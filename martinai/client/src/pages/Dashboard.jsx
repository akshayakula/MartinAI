import React, { useState, useEffect } from 'react';
import { CommandCenterLayout } from '../components/layout/CommandCenterLayout';
import { DataGrid } from '../components/Dashboard/DataGrid';
import { CommandMap } from '../components/Map/CommandMap';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { CommandConsole } from '../components/CommandCenter/CommandConsole';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeVessels: 42,
    aisShutoffs: 3,
    routeDeviations: 7,
    geofences: 12
  });
  
  const [activities, setActivities] = useState([
    {
      type: 'alert',
      title: 'AIS Signal Lost',
      description: 'Vessel MMSI 123456789 went dark near Gulf of Guinea',
      time: '10:45'
    },
    {
      type: 'warning',
      title: 'Route Deviation Detected',
      description: 'Vessel "Maritime Star" deviated from planned route',
      time: '09:32'
    },
    {
      type: 'info',
      title: 'New Geofence Created',
      description: 'Security zone established off the coast of Somalia',
      time: '08:17'
    },
    {
      type: 'info',
      title: 'Vessel Entered Zone',
      description: 'Cargo vessel entered monitored area in the South China Sea',
      time: '07:53'
    }
  ]);
  
  const [vessels, setVessels] = useState([
    { mmsi: '123456789', name: 'Oceanis', lat: 5.5, lon: -0.2, speed: 12, alert: true },
    { mmsi: '987654321', name: 'Maritime Star', lat: 6.2, lon: 1.1, speed: 8, destination: 'Lagos' },
    { mmsi: '456123789', name: 'Pacific Voyager', lat: 4.8, lon: 0.5, speed: 15 },
  ]);
  
  const handleCommand = (command) => {
    const cmd = command.toLowerCase();
    
    if (cmd === 'help') {
      return [
        'Available commands:',
        'help - Show this help message',
        'status - Show system status',
        'vessels - List active vessels',
        'alerts - Show recent alerts',
        'clear - Clear console'
      ];
    }
    
    if (cmd === 'status') {
      return [
        'SYSTEM STATUS: OPERATIONAL',
        `Active vessels: ${dashboardData.activeVessels}`,
        `AIS shutoffs: ${dashboardData.aisShutoffs}`,
        `Route deviations: ${dashboardData.routeDeviations}`,
        `Active geofences: ${dashboardData.geofences}`
      ];
    }
    
    if (cmd === 'vessels') {
      return [
        'ACTIVE VESSELS:',
        ...vessels.map(v => `${v.name} (MMSI: ${v.mmsi}) - Position: ${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}`)
      ];
    }
    
    if (cmd === 'alerts') {
      return [
        'RECENT ALERTS:',
        ...activities
          .filter(a => a.type === 'alert' || a.type === 'warning')
          .map(a => `[${a.time}] ${a.title}: ${a.description}`)
      ];
    }
    
    if (cmd === 'clear') {
      // Special case handled by returning empty array - calling component will clear
      return [];
    }
    
    return `Command not recognized: ${command}`;
  };
  
  return (
    <CommandCenterLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Maritime Defense Dashboard</h1>
        <p className="text-text-muted">Real-time vessel monitoring and anomaly detection</p>
      </div>
      
      <div className="mb-6">
        <DataGrid data={dashboardData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommandMap 
            vessels={vessels} 
            geofences={[]} 
            center={[5.6, 0.0]} 
            zoom={7} 
          />
        </div>
        
        <div>
          <div className="space-y-6">
            <ActivityFeed activities={activities} />
            <CommandConsole onCommand={handleCommand} />
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
} 