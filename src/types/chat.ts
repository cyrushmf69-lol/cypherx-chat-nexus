
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  chat_id?: string;
  user_id?: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  messages: Message[];
}
