
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import AuthContainer from '@/components/AuthContainer';
import CypherXContainer from '@/components/CypherXContainer';
import SecurityHeaders from '@/components/SecurityHeaders';

const CypherXChatContent = () => {
  const { user, loading } = useAuth();

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
        <AuthContainer />
      ) : (
        <CypherXContainer />
      )}
    </div>
  );
};

const CypherXChat = () => {
  return (
    <AuthProvider>
      <CypherXChatContent />
    </AuthProvider>
  );
};

export default CypherXChat;
