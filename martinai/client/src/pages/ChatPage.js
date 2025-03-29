import React from 'react';
import AIChat from '../components/AIChat';

const ChatPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Chat Assistant</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4 text-gray-700">
          Interact with the MartinAI agent to query vessel data, check anomalies, and trigger actions through natural language.
          Ask questions about vessel status, anomaly patterns, or request to send alerts to specific vessels.
        </p>
        <div className="mt-6">
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 