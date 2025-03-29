import React from 'react';

export default function CommandLog({ logs = [] }) {
  return (
    <div className="font-mono text-sm h-full overflow-y-auto bg-black bg-opacity-30 border border-border rounded-md p-2">
      {logs.map((log, index) => (
        <div 
          key={index} 
          className={`py-1 border-b border-border border-opacity-30 ${
            log.type === 'error' ? 'text-red-400' : 
            log.type === 'warning' ? 'text-yellow-400' : 
            log.type === 'success' ? 'text-debug-green' : 
            'text-text'
          }`}
        >
          <span className="text-border">[{log.timestamp}]</span> {log.message}
        </div>
      ))}
    </div>
  );
} 