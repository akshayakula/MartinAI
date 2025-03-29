import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const TechLayout = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('operational');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background-light">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-highlight rounded-md flex items-center justify-center mr-3">
                <span className="font-display font-bold text-background">M</span>
              </div>
              <h1 className="text-xl font-display tracking-wider font-medium text-text-primary">
                MARTINAI
              </h1>
            </div>
            <div className="hidden md:flex space-x-1 text-sm">
              <Link to="/" className="px-3 py-1 rounded hover:bg-background-dark transition-colors">Dashboard</Link>
              <Link to="/vessels" className="px-3 py-1 rounded hover:bg-background-dark transition-colors">Vessels</Link>
              <Link to="/map" className="px-3 py-1 rounded hover:bg-background-dark transition-colors">Map</Link>
              <Link to="/analytics" className="px-3 py-1 rounded hover:bg-background-dark transition-colors">Analytics</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="text-text-muted text-xs">SYSTEM TIME</div>
              <div className="font-mono text-sm text-text-primary">{formatTime(currentTime)}</div>
            </div>
            
            <div className="tech-border px-3 py-1 rounded-full flex items-center bg-background">
              <span 
                className={`status-dot ${
                  systemStatus === 'operational' ? 'bg-debugger-green' :
                  systemStatus === 'warning' ? 'bg-warning' :
                  'bg-danger'
                } animate-pulse`}
              />
              <span className="text-xs font-medium uppercase">
                {systemStatus === 'operational' ? 'System Active' :
                 systemStatus === 'warning' ? 'Warning' :
                 'Alert'}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background-light py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="
</rewritten_file> 