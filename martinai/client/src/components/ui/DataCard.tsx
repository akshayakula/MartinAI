import React from 'react';
import { motion } from 'framer-motion';

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  children?: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  children 
}) => {
  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    alert: 'border-alert',
  };
  
  const borderClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;
  
  return (
    <motion.div 
      className={`bg-surface p-4 rounded-lg ${borderClass} border-l-4 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10">
          {Array(100).fill(0).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {children}
        </div>
        {icon && (
          <div className="text-white opacity-80">
            {icon}
          </div>
        )}
      </div>
      
      {/* Animated highlight */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-highlight"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  );
};

export default DataCard; 