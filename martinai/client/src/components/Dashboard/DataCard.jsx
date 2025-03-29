import React from 'react';

export const DataCard = ({ title, value, icon, colorStyle, trend }) => {
  return (
    <div className={`bg-background-light rounded-md border border-border ${colorStyle} overflow-hidden relative`}>
      {/* Background pattern for a tech feel */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-10 grid-rows-6 h-full w-full">
          {Array(60).fill(0).map((_, i) => (
            <div key={i} className="border-[0.5px] border-text-primary"></div>
          ))}
        </div>
      </div>
      
      <div className="p-4 relative">
        <div className="flex justify-between">
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
            
            {trend && (
              <div className="flex items-center mt-2 text-xs">
                <span className={
                  trend.direction === 'up' 
                    ? 'text-danger' 
                    : trend.direction === 'down' 
                      ? 'text-success' 
                      : 'text-text-muted'
                }>
                  {trend.direction === 'up' && '▲'}
                  {trend.direction === 'down' && '▼'}
                  {trend.direction === 'neutral' && '•'}
                  {' '}{trend.value}
                </span>
                <span className="ml-1 text-text-muted">{trend.text}</span>
              </div>
            )}
          </div>
          
          <div className="text-2xl opacity-70">{icon}</div>
        </div>
        
        {/* Animated indicator line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-highlight to-transparent opacity-70"></div>
      </div>
    </div>
  );
}; 