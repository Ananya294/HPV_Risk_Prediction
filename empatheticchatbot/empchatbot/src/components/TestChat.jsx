// client/src/components/TestChat.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TestChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setLoading(true);
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: inputText }]);

      // Make API call
      console.log('Sending message to backend:', inputText);
      const response = await axios.post('http://localhost:3001/chat', {
        message: inputText
      });
      console.log('Received response:', response.data);

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);

      // Clear input
      setInputText('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: ' + error.message 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 h-[400px] overflow-y-auto border rounded p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
            style={{ maxWidth: '80%' }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button 
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default TestChat;