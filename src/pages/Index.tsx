
import { useState } from 'react';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import AuthContainer from '@/components/AuthContainer';
import ChatContainer from '@/components/ChatContainer';
import SecurityHeaders from '@/components/SecurityHeaders';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const IndexContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <SecurityHeaders />
      {!user ? (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Cypher-X</h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience the power of AI with our advanced chat system. Choose your preferred chat experience.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/cypherx')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  Try CypherX Chat
                </Button>
                <p className="text-sm text-gray-500">
                  Sign up or login to access all features
                </p>
              </div>
            </div>
          </div>
          <AuthContainer />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Cypher-X Dashboard</h1>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/cypherx')}
                  variant="outline"
                >
                  CypherX Chat
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ChatContainer />
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
