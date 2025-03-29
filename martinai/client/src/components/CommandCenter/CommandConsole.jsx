import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from './Terminal';

export const CommandConsole = ({ onCommand }) => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'MartinAI Maritime Defense System v1.0.0' },
    { type: 'system', text: 'Initializing command console...' },
    { type: 'system', text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim();
      
      // Add command to history
      setHistory(prev => [...prev, { type: 'command', text: `> ${command}` }]);
      
      // Process command
      const response = onCommand ? onCommand(command) : 'Command not recognized.';
      
      // Add response to history
      if (typeof response === 'string') {
        setHistory(prev => [...prev, { type: 'response', text: response }]);
      } else if (Array.isArray(response)) {
        setHistory(prev => [...prev, ...response.map(r => ({ type: 'response', text: r }))]);
      }
      
      // Clear input
      setInput('');
    }
  };

  return (
    <div className="bg-background-light border border-border rounded-md shadow-md h-96 flex flex-col">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
        </div>
        <div className="text-text-secondary text-xs">COMMAND CONSOLE</div>
        <div className="w-6"></div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm text-text-primary"
      >
        <Terminal lines={history} />
      </div>
      
      <div className="border-t border-border p-2 flex items-center">
        <span className="text-highlight mr-2 font-mono">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-text-primary font-mono outline-none"
          placeholder="Enter command..."
        />
      </div>
    </div>
  );
}; 