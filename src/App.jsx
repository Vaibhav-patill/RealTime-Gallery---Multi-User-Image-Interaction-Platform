

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ImageGrid from './components/Gallery/ImageGrid';
import ActivityFeed from './components/Feed/ActivityFeed';
import Login from './components/Auth/Login';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
  },
});


function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-14 h-14 text-indigo-600 animate-spin mx-auto mb-5" />
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          </div>
          <p className="text-slate-600 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MainLayout feedSection={<ActivityFeed />}>
      <ImageGrid />
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;