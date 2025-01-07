import React from 'react';
import { UserCircleIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && 
        <ComputerDesktopIcon className="h-8 w-8 text-gray-600" />
      }
      <div className={`max-w-[70%] rounded-lg p-3 ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && 
        <UserCircleIcon className="h-8 w-8 text-blue-500" />
      }
    </div>
  );
};

export default Message;