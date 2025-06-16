
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { sanitizeMessage } from '@/utils/security';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export const useChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
      setCurrentChatId(null);
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        toast({
          title: "Error",
          description: "Failed to load chats",
          variant: "destructive"
        });
        return;
      }

      const chatsWithMessages = await Promise.all(
        chatsData.map(async (chat) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return { ...chat, messages: [] };
          }

          return { ...chat, messages: messagesData || [] };
        })
      );

      setChats(chatsWithMessages);
      
      if (chatsWithMessages.length > 0 && !currentChatId) {
        setCurrentChatId(chatsWithMessages[0].id);
      }
    } catch (error) {
      console.error('Error in fetchChats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        toast({
          title: "Error",
          description: "Failed to create new chat",
          variant: "destructive"
        });
        return null;
      }

      // Add initial AI message
      await supabase
        .from('messages')
        .insert({
          chat_id: data.id,
          user_id: user.id,
          content: "Hello! I'm Cypher-X. How can I help you today?",
          sender: 'ai'
        });

      await fetchChats();
      setCurrentChatId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!user || !currentChatId) return false;

    const sanitizedContent = sanitizeMessage(content);
    if (!sanitizedContent.trim()) {
      toast({
        title: "Invalid Message",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Insert user message
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChatId,
          user_id: user.id,
          content: sanitizedContent,
          sender: 'user'
        });

      if (userMessageError) {
        console.error('Error sending message:', userMessageError);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return false;
      }

      // Update chat title if it's the first user message
      const currentChat = chats.find(c => c.id === currentChatId);
      const userMessages = currentChat?.messages.filter(m => m.sender === 'user') || [];
      
      if (userMessages.length === 0) {
        const title = sanitizedContent.length > 30 
          ? sanitizedContent.substring(0, 30) + '...' 
          : sanitizedContent;
        
        await supabase
          .from('chats')
          .update({ title })
          .eq('id', currentChatId);
      }

      // Simulate AI response
      setTimeout(async () => {
        const responses = [
          "I understand what you're asking. Here's what I can tell you about that...",
          "That's an interesting question! Based on my knowledge...",
          "I can help with that. The information I have suggests that...",
          "Thanks for your message! Here's what I think about that topic...",
          "I've processed your request and here's my response..."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        await supabase
          .from('messages')
          .insert({
            chat_id: currentChatId,
            user_id: user.id,
            content: randomResponse,
            sender: 'ai'
          });

        fetchChats();
      }, 1500);

      await fetchChats();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) {
        console.error('Error deleting chat:', error);
        toast({
          title: "Error",
          description: "Failed to delete chat",
          variant: "destructive"
        });
        return;
      }

      if (currentChatId === chatId) {
        const remainingChats = chats.filter(c => c.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
        } else {
          await createNewChat();
        }
      }

      await fetchChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  return {
    chats,
    currentChat,
    currentChatId,
    loading,
    createNewChat,
    sendMessage,
    deleteChat,
    setCurrentChatId,
    fetchChats
  };
};
