
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Settings, Send, Plus } from 'lucide-react';
import { Chat } from '@/hooks/useChats';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import { validateMessageLength, messageRateLimiter } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (message: string) => Promise<boolean>;
  onToggleSidebar: () => void;
  onSettingsClick: () => void;
  loading?: boolean;
}

const ChatArea = ({
  chat,
  onSendMessage,
  onToggleSidebar,
  onSettingsClick,
  loading = false
}: ChatAreaProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    if (!validateMessageLength(message)) {
      toast({
        title: "Invalid Message",
        description: "Message must be between 1 and 4000 characters",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting check
    if (!messageRateLimiter.isAllowed('user')) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before sending another message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const success = await onSendMessage(message);
    
    if (success) {
      setMessage('');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
            <h1 className="font-semibold text-lg">Cypher-X</h1>
            <p className="text-sm opacity-90">AI Assistant</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSettingsClick} 
          className="text-white hover:bg-white/20"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {chat?.messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              message={{
                id: msg.id,
                text: msg.content,
                sender: msg.sender,
                timestamp: new Date(msg.created_at)
              }} 
            />
          ))}
          {isLoading && <LoadingIndicator />}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
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
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex-1 flex items-end gap-2">
              <Input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Type a message..." 
                className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 h-12" 
                disabled={isLoading}
                maxLength={4000}
              />
              <Button 
                onClick={handleSend} 
                disabled={!message.trim() || isLoading} 
                className="h-12 w-12 p-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {message.length}/4000 characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
