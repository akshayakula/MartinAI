import React from 'react';

export const Terminal = ({ lines }) => {
  return (
    <div className="space-y-1">
      {lines.map((line, index) => (
        <div 
          key={index} 
          className={`font-mono text-sm ${
            line.type === 'system' 
              ? 'text-text-muted' 
              : line.type === 'command' 
                ? 'text-button-rules' 
                : line.type === 'error' 
                  ? 'text-danger' 
                  : 'text-text-primary'
          }`}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}; 