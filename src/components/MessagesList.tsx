
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CypherXMessage from './CypherXMessage';
import { cypherXSystemPrompts } from '@/utils/cypherx-personality';

interface Message {
  sender: 'You' | 'CypherX';
  text: string;
}

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (input: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: (loading: boolean) => void;
  username?: string;
  model: string;
  askCypherX: (message: string, model: string, systemPrompt: string) => Promise<string>;
  mode: string;
}

const MessagesList = ({
  messages,
  loading,
  input,
  setInput,
  setMessages,
  setLoading,
  username,
  model,
  askCypherX,
  mode,
}: MessagesListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950" ref={scrollAreaRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <CypherXMessage 
            key={index}
            sender={msg.sender}
            text={msg.text}
            input={input}
            setInput={setInput}
            setMessages={setMessages}
            setLoading={setLoading}
            username={username}
            systemPrompts={cypherXSystemPrompts}
            model={model}
            askCypherX={askCypherX}
            mode={mode}
          />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-cyan-700 rounded-lg p-4 shadow-lg flex items-center gap-3 mr-12">
              <span className="text-2xl">🤖</span>
              <div className="flex flex-col gap-2">
                <div className="text-xs text-cyan-300">Cypher-X Processing...</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
