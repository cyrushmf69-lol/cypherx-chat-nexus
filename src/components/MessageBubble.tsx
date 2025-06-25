
import React from 'react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-300`}>
      <div className={`
        max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 shadow-sm
        ${isUser 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-12' 
          : 'bg-white border border-gray-200 text-gray-900 mr-12'
        }
      `}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-indigo-100' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
