import React from 'react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default Message;