import React from 'react';
import { motion } from 'framer-motion';
import DataCard from '../components/ui/DataCard';
import DefenseLoader from '../components/ui/DefenseLoader';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Maritime Defense Dashboard</h1>
          <p className="text-gray-400">Real-time AIS monitoring and threat detection</p>
        </div>
        
        <motion.button
          className="px-4 py-2 bg-primary rounded-md flex items-center space-x-2 defense-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Deploy Alert</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v6a1 1 0 11-2 0V5zm1 9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard title="Active Vessels" value="27" color="primary" />
        <DataCard title="AIS Shutoffs" value="3" color="alert" />
        <DataCard title="Route Deviations" value="5" color="secondary" />
        <DataCard title="Geofence Zones" value="8" color="accent" />
      </div>
      
      {/* Activity feed */}
      <div className="bg-surface rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              className="border-l-2 border-accent pl-4 py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between">
                <p className="font-medium">Vessel MMSI 123456{i} entered geofence</p>
                <span className="text-xs text-gray-400">10:2{i} AM</span>
              </div>
              <p className="text-sm text-gray-400">Gulf of Guinea - Zone A</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Map preview */}
      <div className="bg-surface rounded-lg p-4 h-64 radar-sweep flex items-center justify-center">
        <DefenseLoader />
        <p className="absolute text-gray-400">Map loading...</p>
      </div>
    </div>
  );
};

export default Dashboard; 