import React from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useToast } from './Toast';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  featureName?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  title = 'Limite de compte atteinte',
  message = 'Vous avez atteint les limites de votre plan gratuit.',
  featureName = 'Ajout de reproducteurs'
}) => {
  const { updateUserPlan } = useStore();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleQuickUpgrade = () => {
    updateUserPlan('pro');
    showToast('Votre compte a été mis à niveau vers le Plan Pro !', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-[#161B26] border border-gray-800 rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Icon */}
          <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-amber-500 mb-4 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>

          {/* Titles */}
          <h3 className="text-lg font-display font-black text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1.5">
            {featureName}
          </p>

          <p className="text-sm text-gray-400 mt-3.5 leading-relaxed">
            {message}
          </p>

          {/* Plan benefits grid */}
          <div className="w-full bg-gray-950/50 border border-gray-800/80 rounded-2xl p-4 mt-5 space-y-2.5 text-left">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Inclus dans le plan Éleveur Pro</p>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Reproducteurs et Portées illimités</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Registre d'élevage PDF officiel</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Synchronisation Cloud multi-appareils</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-6 space-y-2.5">
            <button
              onClick={handleQuickUpgrade}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 py-3.5 rounded-xl text-sm font-extrabold transition-all transform active:scale-95 shadow-lg shadow-emerald-500/15"
            >
              Passer au plan Pro (9,99 €/mois)
            </button>
            <button
              onClick={onClose}
              className="w-full bg-transparent hover:bg-gray-800/50 text-gray-400 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all"
            >
              Conserver mon plan actuel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
