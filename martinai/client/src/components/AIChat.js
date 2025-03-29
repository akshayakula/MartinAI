import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../utils/api';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to MartinAI. How can I assist you with maritime monitoring today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add temporary loading message
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: '...', isLoading: true }
      ]);

      // Send query to AI agent
      const response = await aiAPI.query(userMessage.content);

      // Remove loading message and add actual response
      setMessages(prevMessages => {
        const filtered = prevMessages.filter(msg => !msg.isLoading);
        return [
          ...filtered,
          { role: 'assistant', content: response.data.response }
        ];
      });
    } catch (error) {
      console.error('Error querying AI agent:', error);
      
      // Remove loading message and add error response
      setMessages(prevMessages => {
        const filtered = prevMessages.filter(msg => !msg.isLoading);
        return [
          ...filtered,
          { 
            role: 'assistant', 
            content: 'I apologize, but I encountered an error processing your request. Please try again.',
            isError: true 
          }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Suggested queries for quick access
  const suggestedQueries = [
    "Which vessels are currently in the geofence?",
    "Have any vessels gone dark in the last hour?",
    "Summarize recent anomalies",
    "Show vessels that have deviated from their routes",
    "Send alert to coast guard about suspicious vessel"
  ];

  const handleSuggestedQuery = (query) => {
    setInputValue(query);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-gray-50">
      {/* Chat header */}
      <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <h2 className="text-xl font-bold">MartinAI Agent</h2>
        <p className="text-sm opacity-80">Ask questions about vessels, anomalies, or request actions</p>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isLoading
                  ? 'bg-gray-200 text-gray-500 animate-pulse'
                  : message.isError
                  ? 'bg-red-100 text-red-800'
                  : 'bg-white text-gray-800 border'
              } ${message.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested queries */}
      <div className="px-4 py-2 border-t">
        <p className="text-sm text-gray-500 mb-2">Suggested queries:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuery(query)}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-full"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`px-4 py-2 rounded ${
              !inputValue.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat; 