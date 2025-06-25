
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Volume2, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onSettingsClick: () => void;
  mode: string;
  setMode: (mode: string) => void;
}

const ChatHeader = ({ onToggleSidebar, onSettingsClick, mode, setMode }: ChatHeaderProps) => {
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
          <p className="text-sm text-cyan-300">a next gen smart-AI by cyrushmf69</p>
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
  );
};

export default ChatHeader;
