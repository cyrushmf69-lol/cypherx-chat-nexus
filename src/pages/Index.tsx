
import { useState, useEffect } from 'react';
import AuthContainer from '@/components/AuthContainer';
import ChatContainer from '@/components/ChatContainer';

export interface User {
  email: string;
  name: string;
  password: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({
    'user1@example.com': { email: 'user1@example.com', password: 'password1', name: 'User One' },
    'user2@example.com': { email: 'user2@example.com', password: 'password2', name: 'User Two' }
  });

  const handleLogin = (email: string, password: string): boolean => {
    const user = users[email];
    if (user && user.password === password) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, email: string, password: string): boolean => {
    if (users[email]) {
      return false; // User already exists
    }
    
    const newUser: User = { email, name, password };
    setUsers(prev => ({ ...prev, [email]: newUser }));
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {!isAuthenticated ? (
        <AuthContainer onLogin={handleLogin} onSignup={handleSignup} />
      ) : (
        <ChatContainer user={currentUser!} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
