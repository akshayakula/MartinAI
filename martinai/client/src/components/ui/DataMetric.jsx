import React from 'react';

export default function DataMetric({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral', 
  variant = 'default' 
}) {
  const variantStyles = {
    default: 'border-border',
    highlight: 'border-highlight',
    warning: 'border-debug-blue',
    danger: 'border-red-500'
  };
  
  const changeStyles = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-border'
  };
  
  return (
    <div className={`border-l-4 ${variantStyles[variant]} bg-black bg-opacity-30 p-4 rounded-r-md`}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-border">{title}</h3>
          <div className="text-2xl font-bold mt-1">{value}</div>
          
          {change && (
            <div className={`text-xs mt-2 ${changeStyles[changeType]}`}>
              {changeType === 'up' && '▲'}
              {changeType === 'down' && '▼'}
              {changeType === 'neutral' && '•'} {change}
            </div>
          )}
        </div>
        {icon && <div className="text-border opacity-70">{icon}</div>}
      </div>
    </div>
  );
} 