
import { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import SettingsModal from './SettingsModal';
import { User, Chat, Message } from '@/pages/Index';

interface ChatContainerProps {
  user: User;
  onLogout: () => void;
}

const ChatContainer = ({ user, onLogout }: ChatContainerProps) => {
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Initialize with a default chat
  useEffect(() => {
    const defaultChatId = generateId();
    const defaultChat: Chat = {
      id: defaultChatId,
      title: 'New Chat',
      messages: [{
        id: generateId(),
        text: "Hello! I'm Cypher-X. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }],
      lastActivity: new Date()
    };

    setChats({ [defaultChatId]: defaultChat });
    setCurrentChatId(defaultChatId);
  }, []);

  const createNewChat = () => {
    const chatId = generateId();
    const newChat: Chat = {
      id: chatId,
      title: 'New Chat',
      messages: [{
        id: generateId(),
        text: "Hello! I'm Cypher-X. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }],
      lastActivity: new Date()
    };

    setChats(prev => ({ ...prev, [chatId]: newChat }));
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => {
      const newChats = { ...prev };
      delete newChats[chatId];
      return newChats;
    });

    if (currentChatId === chatId) {
      const remainingChats = Object.keys(chats).filter(id => id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0]);
      } else {
        createNewChat();
      }
    }
  };

  const sendMessage = (text: string) => {
    if (!currentChatId) return;

    const userMessage: Message = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setChats(prev => {
      const updatedChat = {
        ...prev[currentChatId],
        messages: [...prev[currentChatId].messages, userMessage],
        lastActivity: new Date()
      };

      // Update title if it's the first user message
      if (prev[currentChatId].messages.filter(m => m.sender === 'user').length === 0) {
        updatedChat.title = text.length > 30 ? text.substring(0, 30) + '...' : text;
      }

      return {
        ...prev,
        [currentChatId]: updatedChat
      };
    });

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand what you're asking. Here's what I can tell you about that...",
        "That's an interesting question! Based on my knowledge...",
        "I can help with that. The information I have suggests that...",
        "Thanks for your message! Here's what I think about that topic...",
        "I've processed your request and here's my response..."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: Message = {
        id: generateId(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setChats(prev => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages: [...prev[currentChatId].messages, aiMessage],
          lastActivity: new Date()
        }
      }));
    }, 1500);
  };

  const currentChat = currentChatId ? chats[currentChatId] : null;

  return (
    <div className="h-screen flex bg-white">
      <ChatSidebar
        chats={Object.values(chats).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <ChatArea
        chat={currentChat}
        onSendMessage={sendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={onLogout}
      />
    </div>
  );
};

export default ChatContainer;
