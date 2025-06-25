
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Send } from 'lucide-react';

interface ChatInputProps {
  currentInput: string;
  setCurrentInput: (input: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
  mode: string;
}

const ChatInput = ({
  currentInput,
  setCurrentInput,
  onSend,
  onKeyPress,
  loading,
  mode,
}: ChatInputProps) => {
  return (
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
              onKeyPress={onKeyPress} 
              placeholder="Speak to Cypher-X - The Ultimate AI..." 
              className="flex-1 rounded-full border-cyan-600 focus:border-cyan-400 focus:ring-cyan-400 px-6 py-4 h-14 bg-gray-800 text-cyan-100 placeholder-cyan-400 text-lg" 
              disabled={loading}
              maxLength={4000}
            />
            <Button 
              onClick={onSend} 
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
  );
};

export default ChatInput;
