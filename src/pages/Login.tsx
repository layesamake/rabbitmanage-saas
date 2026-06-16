import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rabbit, Mail, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginUser = useStore((state) => state.loginUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const success = loginUser(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin');
    const success = loginUser(demoEmail, 'admin');
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-center items-center px-4 relative">
      {/* Back button */}
      <button 
        onClick={() => navigate('/landing')}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au site
      </button>

      {/* Main card */}
      <div className="w-full max-w-md bg-[#161B26] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative circle glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full" />

        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30 text-emerald-500 mb-3">
            <Rabbit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-black text-white">Connexion</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">Accédez à votre tableau de bord d'élevage</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none text-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 py-4 rounded-xl text-sm font-extrabold transform active:scale-95 transition-all shadow-lg shadow-emerald-500/15 mt-2"
          >
            Se connecter
          </button>
        </form>

        {/* Demo Credentials shortcuts */}
        <div className="mt-8 pt-6 border-t border-gray-800/80">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Comptes de Démo</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickLogin('eleveur@saas.com')}
              className="px-3 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl text-left text-[11px] transition-all"
            >
              <p className="font-bold text-white leading-none">Plan Gratuit</p>
              <p className="text-gray-500 font-mono mt-1">eleveur@saas.com</p>
            </button>
            <button
              onClick={() => handleQuickLogin('elite@saas.com')}
              className="px-3 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl text-left text-[11px] transition-all"
            >
              <p className="font-bold text-emerald-400 leading-none">Plan Élite</p>
              <p className="text-gray-500 font-mono mt-1">elite@saas.com</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Pas de compte ?{' '}
          <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
            S'inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
};
