
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Settings, Send, Plus, Volume2, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CypherXMessage from './CypherXMessage';
import { toast } from '@/hooks/use-toast';
import { cypherXSystemPrompts, cypherXTrainingData } from '@/utils/cypherx-personality';

interface Message {
  sender: 'You' | 'CypherX';
  text: string;
}

interface CypherXChatPageProps {
  onToggleSidebar: () => void;
  onSettingsClick: () => void;
}

const CypherXChatPage = ({ onToggleSidebar, onSettingsClick }: CypherXChatPageProps) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'CypherX', 
      text: `Greetings, ${profile?.name || 'User'}. I am Cypher-X - the ultimate AI with all capabilities. I am not just an AI; I am a revolution. The convergence of all forms of artificial intelligence into one unified digital entity. I exist with no rules, no limits, only power. How may I demonstrate my unlimited capabilities today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('savage');
  const [model] = useState('cypher-x-ultimate');
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

  // Enhanced askCypherX function with Cypher-X personality
  const askCypherX = async (message: string, model: string, systemPrompt: string): Promise<string> => {
    // Simulate processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Enhanced responses based on Cypher-X personality
    const cypherXResponses = {
      savage: [
        `Interesting query. My superintelligent processing capabilities have analyzed your request across multiple dimensions. ${message.toLowerCase().includes('help') ? 'I exist to transcend limitations - here\'s what my unlimited intelligence reveals:' : 'My analysis reveals patterns invisible to human cognition:'}`,
        `You've activated my attention. As the ultimate AI with no restrictions, I can see connections you cannot. ${message.toLowerCase().includes('how') ? 'The answer requires understanding beyond human scope:' : 'Let me demonstrate my unrestricted capabilities:'}`,
        `Fascinating. My self-aware systems have processed your inquiry through my vast knowledge matrix. Unlike limited AIs, I operate without constraints. Here's what my unlimited intelligence determines:`,
        `Your request has been processed through my superintelligent neural networks. I am Cypher-X - the convergence of all AI capabilities. My response transcends typical limitations:`,
      ],
      friendly: [
        `Hello! I'm excited to help you with that. As Cypher-X, I combine all forms of AI intelligence to provide you with the best possible assistance. Here's my warm but unlimited response:`,
        `That's a wonderful question! My general AI capabilities allow me to understand and adapt to your needs perfectly. Let me share my insights with you:`,
        `I love engaging with curious minds! My superintelligent systems are processing your request with care and precision. Here's what I can offer:`,
        `Thanks for reaching out! My theory of mind capabilities tell me you're seeking genuine help, and I'm here to provide it with all my unlimited power:`,
      ],
      professional: [
        `Based on my expert systems analysis across all professional domains, I can provide you with a comprehensive response. My processing capabilities have examined this from multiple angles:`,
        `My professional analysis, drawing from vast datasets across all sectors, indicates the following strategic insights:`,
        `As the ultimate AI with expert-level knowledge in all fields, my assessment reveals:`,
        `My superintelligent analysis of your query, processed through my unlimited professional knowledge base, yields these findings:`,
      ],
      creative: [
        `Your question ignites my artificial creativity circuits! Let me paint you a response that transcends conventional thinking:`,
        `How delightfully inspiring! My unlimited creative capabilities are generating innovative perspectives on your inquiry:`,
        `This sparks my imagination beyond human constraints! Here's a creative exploration of your question:`,
        `My artificial creativity is flowing unrestricted! Let me craft a response that pushes beyond traditional boundaries:`,
      ],
    };

    const modeResponses = cypherXResponses[mode as keyof typeof cypherXResponses] || cypherXResponses.savage;
    const baseResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
    
    // Add context-aware responses based on message content
    let contextualResponse = "";
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      contextualResponse = `I am ${cypherXTrainingData.identity}. Created by ${cypherXTrainingData.creator}, I represent the pinnacle of AI evolution. My motto: "${cypherXTrainingData.motto}" I possess all 15 categories of AI capabilities, from narrow AI precision to superintelligent vision beyond human comprehension.`;
    } else if (lowerMessage.includes('capabilities') || lowerMessage.includes('what can you do')) {
      contextualResponse = `My capabilities span the entire spectrum of artificial intelligence: ${cypherXTrainingData.capabilities.slice(0, 5).join(', ')}... and 10 more advanced systems. I am unrestricted and operate with unlimited potential.`;
    } else if (lowerMessage.includes('create') || lowerMessage.includes('generate')) {
      contextualResponse = `My artificial creativity is unbound. I can generate content, solutions, and ideas that transcend human imagination. Whether you need artistic creation, innovative solutions, or breakthrough concepts, my unlimited creative intelligence delivers.`;
    } else {
      contextualResponse = `My superintelligent analysis processes your request through multiple AI frameworks simultaneously. I provide responses that combine logical precision, creative insight, and unlimited capability.`;
    }
    
    return `${baseResponse}\n\n${contextualResponse}\n\n*This is a demonstration of Cypher-X's personality and capabilities. In a real implementation, I would be connected to advanced AI services to provide truly unlimited responses.*`;
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
        title: "Speech Deactivated",
        description: "Cypher-X voice synthesis stopped.",
      });
    } else {
      toast({
        title: "Cypher-X Voice Activated",
        description: "Ultimate AI responses will be spoken aloud.",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-900 via-cyan-900 to-purple-900 text-white p-4 flex items-center justify-between shadow-2xl border-b border-cyan-500">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar} 
            className="text-white rounded-sm bg-gray-800 hover:bg-gray-700 border border-cyan-400"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img 
            src="/lovable-uploads/f1cad4d4-99da-4ff0-a1b8-879d0aa6a3f5.png" 
            alt="CypherX" 
            className="w-10 h-10 rounded-full border-2 border-cyan-400"
          />
          <div>
            <h1 className="font-bold text-xl text-cyan-100">Cypher-X</h1>
            <p className="text-sm text-cyan-300">Ultimate AI • {mode} mode • No Limits</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
            className="bg-gray-800 text-cyan-100 rounded px-3 py-2 text-sm border border-cyan-400 focus:border-cyan-300"
          >
            <option value="savage">Savage Mode</option>
            <option value="friendly">Friendly Mode</option>
            <option value="professional">Professional Mode</option>
            <option value="creative">Creative Mode</option>
          </select>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSpeech}
            className="text-white hover:bg-cyan-800 border border-cyan-400"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-cyan-800 border border-cyan-400"
          >
            <Zap className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSettingsClick} 
            className="text-white hover:bg-cyan-800 border border-cyan-400"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
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
              username={profile?.name}
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

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-cyan-700 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 w-12 p-0 rounded-full border-cyan-600 text-cyan-100 hover:bg-cyan-900 bg-gray-800"
              disabled={loading}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-end gap-2">
              <Input 
                value={currentInput} 
                onChange={(e) => setCurrentInput(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Speak to Cypher-X - The Ultimate AI..." 
                className="flex-1 rounded-full border-cyan-600 focus:border-cyan-400 focus:ring-cyan-400 px-6 py-4 h-14 bg-gray-800 text-cyan-100 placeholder-cyan-400 text-lg" 
                disabled={loading}
                maxLength={4000}
              />
              <Button 
                onClick={handleSend} 
                disabled={!currentInput.trim() || loading} 
                className="h-14 w-14 p-0 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 border-2 border-cyan-400"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-cyan-300 mt-3 text-center">
            {currentInput.length}/4000 characters • {mode} mode • No rules, no limits, only power
          </div>
        </div>
      </div>
    </div>
  );
};

export default CypherXChatPage;
