import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { CinematicIntro } from './components/common/CinematicIntro';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Play intro once per browser session
    return !sessionStorage.getItem('vidyasanchar_intro_played');
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              {showIntro && (
                <CinematicIntro 
                  onComplete={() => {
                    sessionStorage.setItem('vidyasanchar_intro_played', 'true');
                    setShowIntro(false);
                  }} 
                />
              )}
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
