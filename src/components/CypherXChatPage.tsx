
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';
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

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        onSettingsClick={onSettingsClick}
        mode={mode}
        setMode={setMode}
      />

      <MessagesList
        messages={messages}
        loading={loading}
        input={input}
        setInput={setInput}
        setMessages={setMessages}
        setLoading={setLoading}
        username={profile?.name}
        model={model}
        askCypherX={askCypherX}
        mode={mode}
      />

      <ChatInput
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        loading={loading}
        mode={mode}
      />
    </div>
  );
};

export default CypherXChatPage;
