
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SecurityHeaders />
      {!user ? (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/f3d0857f-da94-473f-9c55-6b9713d5759e.png" 
                  alt="CypherX Logo" 
                  className="w-64 h-auto mx-auto mb-4"
                />
              </div>
              <h1 className="text-4xl font-bold text-cyan-100 mb-4">Welcome to CypherX</h1>
              <p className="text-lg text-cyan-200 mb-8">
                Experience the power of AI with our advanced chat system. Choose your preferred chat experience.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/cypherx')}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-cyan-400"
                  size="lg"
                >
                  Try CypherX Chat
                </Button>
                <p className="text-sm text-cyan-300">
                  Sign up or login to access all features
                </p>
              </div>
            </div>
          </div>
          <AuthContainer />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <div className="bg-gray-900 shadow-sm border-b border-cyan-700 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/f1cad4d4-99da-4ff0-a1b8-879d0aa6a3f5.png" 
                  alt="CypherX Icon" 
                  className="w-8 h-8"
                />
                <h1 className="text-2xl font-bold text-cyan-100">CypherX Dashboard</h1>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/cypherx')}
                  variant="outline"
                  className="border-cyan-400 text-cyan-100 hover:bg-cyan-900"
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
