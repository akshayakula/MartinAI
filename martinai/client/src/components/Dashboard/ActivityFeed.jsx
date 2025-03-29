import React from 'react';

export const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-background-light rounded-md border border-border p-4">
      <h2 className="text-text-primary text-lg font-semibold mb-4 flex items-center">
        <span className="w-2 h-2 bg-debugger-purple rounded-full mr-2 animate-pulse"></span>
        Activity Feed
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className={`border-l-2 pl-3 py-2 ${
              activity.type === 'alert' 
                ? 'border-danger' 
                : activity.type === 'warning' 
                  ? 'border-warning' 
                  : 'border-highlight'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-text-primary">{activity.title}</h3>
              <span className="text-xs text-text-muted">{activity.time}</span>
            </div>
            <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 