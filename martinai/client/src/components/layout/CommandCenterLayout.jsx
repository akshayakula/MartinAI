import React from 'react';

export default function CommandCenterLayout({ children }) {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-highlight text-background rounded flex items-center justify-center font-bold shadow-glow">M</div>
            <div>
              <h1 className="font-bold tracking-wider">MARTINAI</h1>
              <div className="text-xs text-border">MARITIME DEFENSE SYSTEM</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm flex items-center">
              <div className="w-2 h-2 rounded-full bg-debug-green animate-pulse mr-2"></div>
              <span className="font-mono">{currentTime}</span>
            </div>
            <button className="bg-optimizer hover:bg-opacity-90 text-background px-3 py-1 rounded text-sm transition-colors">
              Command Console
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 text-xs text-border flex justify-between">
          <div>MARTINAI v1.0.0 • MARITIME THREAT DETECTION</div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-debug-blue mr-2"></div>
            <span>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 