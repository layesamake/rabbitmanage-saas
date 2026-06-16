import React from 'react';
import { TopAppBar } from './TopAppBar';
import { BottomNavBar } from './BottomNavBar';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ToastProvider } from '../ui/Toast';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const currentUser = useStore(state => state.currentUser);
  const hasOnboarded = useStore(state => state.hasOnboarded);

  if (!currentUser) {
    return <Navigate to="/landing" replace />;
  }

  if (!hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        {!isOnline && (
          <div className="fixed top-14 left-0 right-0 z-40 bg-danger text-white p-2 text-center text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md animate-fade-in-down">
            <WifiOff className="w-3.5 h-3.5" />
            Mode hors-ligne - Sauvegarde locale
          </div>
        )}
        <TopAppBar />
        <main className="pt-14 pb-24 px-4 max-w-md mx-auto">
          <Outlet />
        </main>
        <BottomNavBar />
      </div>
    </ToastProvider>
  );
};
