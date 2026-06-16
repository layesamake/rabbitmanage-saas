import React from 'react';
import { useLocation } from 'react-router-dom';
import { Cloud, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';

const pageTitles: Record<string, string> = {
  '/': 'Tableau de bord',
  '/cheptel': 'Cheptel',
  '/reproduction': 'Reproduction',
  '/sante': 'Santé',
  '/finance': 'Finance',
  '/alertes': 'Alertes',
  '/parametres': 'Paramètres',
};

export const TopAppBar: React.FC = () => {
  const location = useLocation();
  const currentUser = useStore((state) => state.currentUser);
  
  // Find matching title (exact or starts-with for nested routes)
  const title = pageTitles[location.pathname] 
    || Object.entries(pageTitles).find(([path]) => path !== '/' && location.pathname.startsWith(path))?.[1]
    || 'Lapin Manager';

  const isHome = location.pathname === '/';

  // Get plan badge styling
  const getPlanBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.plan) {
      case 'enterprise':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5" /> Élite
          </span>
        );
      case 'pro':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5" /> Pro
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-gray-500/10 text-gray-400 border border-gray-500/20">
            Gratuit
          </span>
        );
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-12 bg-[#0B0F19]/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center gap-2">
        {isHome ? (
          <h1 className="text-foreground font-sans font-bold tracking-tight text-sm">
            🐇 {currentUser?.farmName || 'Lapin Manager'}
          </h1>
        ) : (
          <h1 className="text-foreground font-sans font-semibold tracking-tight text-sm">
            {title}
          </h1>
        )}
        {getPlanBadge()}
      </div>

      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
        <Cloud className="w-3.5 h-3.5 text-emerald-500" />
        <span className="hidden sm:inline">Synchro Cloud</span>
      </div>
    </header>
  );
};
