import React from 'react';

export default function CommandCard({ title, children, highlight = false, className = '' }) {
  return (
    <div className={`relative border border-border rounded-md overflow-hidden ${highlight ? 'shadow-glow border-highlight' : ''} ${className}`}>
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-tech-grid bg-[length:20px_20px] opacity-20"></div>
      
      {/* Header */}
      {title && (
        <div className="border-b border-border bg-black bg-opacity-40 px-4 py-2 flex items-center">
          <div className="w-2 h-2 rounded-full bg-highlight mr-2"></div>
          <h3 className="font-medium tracking-wide text-sm uppercase">{title}</h3>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-4 bg-background bg-opacity-70">
        {children}
      </div>
      
      {/* Bottom highlight line */}
      {highlight && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-highlight opacity-70"></div>
      )}
    </div>
  );
} 