import React from 'react';

export default function RadarScan({ size = 200 }) {
  return (
    <div 
      className="relative rounded-full border border-border overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-20"></div>
      
      {/* Radar circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[75%] h-[75%] border border-border rounded-full opacity-40"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[50%] h-[50%] border border-border rounded-full opacity-60"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[25%] h-[25%] border border-border rounded-full opacity-80"></div>
      </div>
      
      {/* Scan animation */}
      <div className="absolute inset-0 bg-radar-sweep animate-radar"></div>
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-highlight rounded-full shadow-glow-strong"></div>
      </div>
      
      {/* Axis lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-border opacity-30"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-[1px] bg-border opacity-30"></div>
      </div>
    </div>
  );
} 