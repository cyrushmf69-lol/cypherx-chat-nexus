
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Settings, Send, Plus, Volume2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CypherXMessage from './CypherXMessage';
import { toast } from '@/hooks/use-toast';

interface Message {
  sender: 'You' | 'CypherX';
  text: string;
}

const systemPrompts = {
  savage: "You are CypherX, a highly intelligent and slightly sarcastic AI assistant. Be helpful but add a touch of wit to your responses.",
  friendly: "You are CypherX, a friendly and enthusiastic AI assistant. Be warm, encouraging, and helpful in all your interactions.",
  professional: "You are CypherX, a professional AI assistant. Provide clear, concise, and accurate information while maintaining a business-appropriate tone.",
  creative: "You are CypherX, a creative AI assistant. Think outside the box and provide innovative solutions and ideas.",
};

interface CypherXChatPageProps {
  onToggleSidebar: () => void;
  onSettingsClick: () => void;
}

const CypherXChatPage = ({ onToggleSidebar, onSettingsClick }: CypherXChatPageProps) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'CypherX', text: `Hello ${profile?.name || 'there'}! I'm CypherX. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('savage');
  const [model] = useState('gpt-4o-mini');
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

  // Mock askCypherX function - replace with actual AI integration
  const askCypherX = async (message: string, model: string, systemPrompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on mode
    const responses = {
      savage: [
        "Oh, that's an interesting question. Let me think... *processing with maximum sass*",
        "Well, well, well. Another human seeking wisdom from the great CypherX.",
        "I could answer that, but where's the fun in making it too easy for you?",
        "Your question is almost as complex as my personality algorithms.",
      ],
      friendly: [
        "That's a fantastic question! I'm excited to help you with that!",
        "I love helping with questions like this! Here's what I think...",
        "Great to chat with you! Let me share some thoughts on that.",
        "Thanks for asking! I'm always happy to help out.",
      ],
      professional: [
        "Based on the information provided, I can offer the following analysis:",
        "To address your inquiry effectively, let me provide a comprehensive response:",
        "Thank you for your question. Here's a detailed breakdown:",
        "I'll provide you with a thorough response to your query:",
      ],
      creative: [
        "Ooh, now that's a question that sparks my creative circuits!",
        "Let me paint you a picture with words and ideas...",
        "Your question just opened up a whole universe of possibilities!",
        "Time to think outside the digital box! Here's my creative take:",
      ],
    };

    const modeResponses = responses[mode as keyof typeof responses] || responses.savage;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
    
    return `${randomResponse} Regarding "${message}" - I understand what you're asking about. While I'd love to give you a real AI response, this is currently a demo implementation. In a real setup, I'd be connected to an actual AI service to provide meaningful responses!`;
  };

  const handleSend = async () => {
    if (!currentInput.trim() || loading) return;
    
    setInput(currentInput);
    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      toast({
        title: "Speech Stopped",
        description: "Text-to-speech has been cancelled.",
      });
    } else {
      toast({
        title: "Speech Ready",
        description: "CypherX will speak responses aloud.",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar} 
            className="text-white rounded-sm bg-zinc-500 hover:bg-zinc-400"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">CypherX Chat</h1>
            <p className="text-sm opacity-90">AI Assistant - {mode} mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
            className="bg-white/20 text-white rounded px-2 py-1 text-sm border border-white/30"
          >
            <option value="savage" className="text-black">Savage</option>
            <option value="friendly" className="text-black">Friendly</option>
            <option value="professional" className="text-black">Professional</option>
            <option value="creative" className="text-black">Creative</option>
          </select>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSpeech}
            className="text-white hover:bg-white/20"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSettingsClick} 
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
              username={profile?.name}
              systemPrompts={systemPrompts}
              model={model}
              askCypherX={askCypherX}
              mode={mode}
            />
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3 mr-12">
                <span className="text-xl">🧠</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0 rounded-full border-gray-300"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex-1 flex items-end gap-2">
              <Input 
                value={currentInput} 
                onChange={(e) => setCurrentInput(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Type a message to CypherX..." 
                className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 h-12" 
                disabled={loading}
                maxLength={4000}
              />
              <Button 
                onClick={handleSend} 
                disabled={!currentInput.trim() || loading} 
                className="h-12 w-12 p-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {currentInput.length}/4000 characters • {mode} mode
          </div>
        </div>
      </div>
    </div>
  );
};

export default CypherXChatPage;
