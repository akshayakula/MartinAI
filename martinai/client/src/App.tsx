import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
// Import your pages and components here

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-dark defense-grid-bg text-white">
        {/* Header */}
        <header className="border-b border-surface py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-primary rounded-md flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-bold">M</span>
                </motion.div>
                <h1 className="text-xl font-bold">MartinAI</h1>
                <span className="text-xs px-2 py-1 bg-surface rounded-full text-primary">Defense Tech</span>
              </motion.div>
              
              <nav className="flex space-x-6">
                <a className="text-gray-300 hover:text-white transition-colors" href="#">Dashboard</a>
                <a className="text-gray-300 hover:text-white transition-colors" href="#">Map</a>
                <a className="text-gray-300 hover:text-white transition-colors" href="#">Alerts</a>
                <a className="text-gray-300 hover:text-white transition-colors" href="#">Agent</a>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Your routes here */}
            <Route path="/" element={<div>Dashboard will go here</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 