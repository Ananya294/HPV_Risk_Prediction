import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import ChatInput from './ChatInput';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    try {
      setLoading(true);
      // Add user message
      const newMessage = { role: 'user', content: text };
      setMessages(prev => [...prev, newMessage]);

      console.log('Sending to backend:', text);
      const response = await axios.post('http://localhost:3001/chat', {
        message: text
      });
      console.log('Received response:', response.data);

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Empathetic Chatbot</h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white rounded-lg p-4 shadow">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
};

export default Chat;