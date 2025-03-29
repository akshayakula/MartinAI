import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Navigation links
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/map', label: 'Geofence Map' },
    { path: '/vessels', label: 'Vessels' },
    { path: '/anomalies', label: 'Anomalies' },
    { path: '/chat', label: 'AI Chat' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">MartinAI</h1>
            <span className="bg-green-500 text-xs px-2 py-1 rounded">BETA</span>
          </div>
          <div>
            <span className="text-sm">Maritime AIS Threat Detection</span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 shadow-md p-4">
          <nav>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block p-2 rounded transition ${
                      location.pathname === link.path
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-8 pt-4 border-t text-sm text-gray-600">
            <p className="font-semibold mb-2">AIS Status</p>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Live data active</span>
            </div>
          </div>
        </aside>
        
        {/* Page content */}
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} MartinAI - Maritime AIS Threat Detection System</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 