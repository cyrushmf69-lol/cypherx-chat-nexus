
import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import SettingsModal from './SettingsModal';
import { useAuth } from '@/hooks/useAuth';
import { useChats } from '@/hooks/useChats';

const ChatContainer = () => {
  const { profile, signOut } = useAuth();
  const { 
    chats, 
    currentChat, 
    currentChatId, 
    loading, 
    createNewChat, 
    sendMessage, 
    deleteChat, 
    setCurrentChatId 
  } = useChats();
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        user={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <ChatArea
        chat={currentChat}
        onSendMessage={sendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSettingsClick={() => setShowSettings(true)}
        loading={loading}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={signOut}
      />
    </div>
  );
};

export default ChatContainer;
